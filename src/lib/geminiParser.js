import { GoogleGenerativeAI } from "@google/generative-ai";

// Rate limiting map
const rateLimitMap = new Map();
const MAX_REQUESTS_PER_HOUR = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

/**
 * Check if user has exceeded rate limit
 */
function checkRateLimit(sessionId = 'default') {
  const now = Date.now();
  const userRequests = rateLimitMap.get(sessionId) || [];
  
  // Remove old requests outside the window
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS_PER_HOUR) {
    const oldestRequest = recentRequests[0];
    const timeUntilReset = Math.ceil((oldestRequest + RATE_LIMIT_WINDOW - now) / 60000); // minutes
    return {
      allowed: false,
      retryAfter: timeUntilReset
    };
  }
  
  // Add current request
  recentRequests.push(now);
  rateLimitMap.set(sessionId, recentRequests);
  
  return { allowed: true };
}

/**
 * Parse resume text and extract structured data using Gemini AI
 * @param {string} resumeText - Plain text from resume
 * @returns {Promise<Object>} Structured resume data
 */
export async function parseResumeWithGemini(resumeText) {
  // Check rate limit
  const rateCheck = checkRateLimit();
  if (!rateCheck.allowed) {
    throw new Error(`Rate limit exceeded. Please try again in ${rateCheck.retryAfter} minutes.`);
  }
  
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    // Using gemini-2.0-flash-exp - the only working model for this API key
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp", 
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    });

    
    const prompt = `
You are an expert resume parser. Extract the following information from this resume and return it as valid JSON.

Extract:
{
  "name": "Full name of the candidate",
  "email": "Email address",
  "phone": "Phone number",
  "skills": ["skill1", "skill2", "skill3", ...],
  "totalExperience": 3,
  "jobTitles": ["Previous Job Title 1", "Previous Job Title 2"],
  "education": ["Degree 1", "Degree 2"],
  "summary": "A brief 2-3 sentence professional summary"
}

IMPORTANT:
- For "skills", extract ALL technical skills including programming languages, frameworks, tools, databases, cloud platforms, etc.
- For "totalExperience", calculate the total years of professional experience as a number
- For "jobTitles", list the job titles from work experience
- For "education", list degrees/certifications
- Return ONLY valid JSON, no markdown formatting, no code blocks, no explanations

Resume Text:
${resumeText}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response (handle markdown code blocks if present)
    let jsonText = text.trim();
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse JSON from Gemini response');
    }
    
    const parsedData = JSON.parse(jsonMatch[0]);
    
    // Validate required fields
    if (!parsedData.skills || !Array.isArray(parsedData.skills)) {
      parsedData.skills = [];
    }
    if (typeof parsedData.totalExperience !== 'number') {
      parsedData.totalExperience = 0;
    }
    
    return parsedData;
    
  } catch (error) {
    console.error('Gemini parsing error:', error);
    
    if (error.message.includes('Rate limit')) {
      throw error;
    }
    
    if (error.message.includes('API key')) {
      throw error;
    }
    
    throw new Error('AI processing failed. Please try again or check your resume format.');
  }
}

// Note: matchJobsWithGemini() has been replaced with matchJobsLocally()
// from jobMatcher.js for better reliability and performance
// AI is now only used for resume parsing, not job matching

