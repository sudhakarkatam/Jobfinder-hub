const OpenAI = require('openai');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { role, years, industry, keySkills, achievements } = req.body;

    const prompt = `Create a professional resume content for a ${role} with ${years} years of experience in ${industry || 'technology'}.

Key skills: ${keySkills || 'Not specified'}
Key achievements: ${achievements || 'Not specified'}

Please provide:
1. A compelling professional summary (2-3 sentences)
2. 2-3 sample work experience entries with realistic job titles, companies, and descriptions
3. A list of relevant skills for this role

Format the response as JSON with the following structure:
{
  "summary": "professional summary here",
  "experience": [
    {
      "title": "job title",
      "company": "company name", 
      "location": "location",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or Present",
      "current": false,
      "description": "job description"
    }
  ],
  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6"]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional resume writer. Generate realistic and compelling resume content based on the user's input. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const response = completion.choices[0].message.content;
    
    // Try to parse the JSON response
    try {
      const parsedResponse = JSON.parse(response);
      return res.status(200).json(parsedResponse);
    } catch (parseError) {
      // If JSON parsing fails, create a structured response
      const fallbackResponse = {
        summary: `Experienced ${role} with ${years} years of expertise in ${industry || 'technology'}. Proven track record of delivering high-quality solutions and driving business growth through innovative approaches.`,
        experience: [
          {
            title: `Senior ${role}`,
            company: 'TechCorp Inc',
            location: 'Remote',
            startDate: '2022-01',
            endDate: 'Present',
            current: true,
            description: `Led development of key features and mentored junior team members. Collaborated with cross-functional teams to deliver innovative solutions.`
          },
          {
            title: `${role}`,
            company: 'Innovation Labs',
            location: 'San Francisco, CA',
            startDate: '2020-03',
            endDate: '2022-01',
            current: false,
            description: `Developed and maintained critical applications. Participated in code reviews and contributed to team best practices.`
          }
        ],
        skills: keySkills ? keySkills.split(',').map(skill => skill.trim()) : ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git']
      };
      return res.status(200).json(fallbackResponse);
    }

  } catch (error) {
    console.error('AI generation error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate resume content',
      message: error.message 
    });
  }
};

