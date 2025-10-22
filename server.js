const express = require('express');
const multer = require('multer');
const cors = require('cors');
const OpenAI = require('openai');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'));
    }
  }
});



// AI Resume Generation Endpoint
app.post('/api/generate-resume', async (req, res) => {
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
      res.json(parsedResponse);
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
      res.json(fallbackResponse);
    }

  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate resume content',
      message: error.message 
    });
  }
});

// Resume Upload and Extraction Endpoint
app.post('/api/extract-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { originalname, mimetype, buffer } = req.file;

    // For demo purposes, return mock extracted data
    // In a real implementation, you would use libraries like pdf-parse for PDFs
    // and mammoth for DOCX files to extract text content
    
    const mockExtractedData = {
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/johndoe'
      },
      summary: 'Experienced software engineer with 5+ years of expertise in web development and cloud technologies. Proven track record of delivering high-quality solutions and driving business growth through innovative approaches.',
      experience: [
        {
          title: 'Senior Software Engineer',
          company: 'TechCorp Inc',
          location: 'San Francisco, CA',
          startDate: '2022-01',
          endDate: 'Present',
          current: true,
          description: 'Led development of key features and mentored junior team members. Collaborated with cross-functional teams to deliver innovative solutions.'
        },
        {
          title: 'Software Engineer',
          company: 'Innovation Labs',
          location: 'San Francisco, CA',
          startDate: '2020-03',
          endDate: '2022-01',
          current: false,
          description: 'Developed and maintained critical applications. Participated in code reviews and contributed to team best practices.'
        }
      ],
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          school: 'University of California',
          location: 'Berkeley, CA',
          startDate: '2018-09',
          endDate: '2022-05',
          gpa: '3.8',
          description: 'Relevant coursework in algorithms, data structures, and software engineering.'
        }
      ],
      skills: [
        {
          category: 'Programming Languages',
          skills: 'JavaScript, Python, Java, C++'
        },
        {
          category: 'Frameworks & Tools',
          skills: 'React, Node.js, Express, MongoDB, AWS'
        },
        {
          category: 'Other Skills',
          skills: 'Git, Docker, Kubernetes, Agile, Scrum'
        }
      ]
    };

    res.json(mockExtractedData);

  } catch (error) {
    console.error('File extraction error:', error);
    res.status(500).json({ 
      error: 'Failed to extract resume content',
      message: error.message 
    });
  }
});

// PDF Generation Endpoint
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { resumeData } = req.body;
    
    // For demo purposes, return a success response
    // In a real implementation, you would use libraries like puppeteer or jsPDF
    // to generate an actual PDF file
    
    res.json({ 
      success: true, 
      message: 'PDF generation endpoint ready',
      data: resumeData 
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate PDF',
      message: error.message 
    });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 