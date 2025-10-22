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

    return res.status(200).json(mockExtractedData);

  } catch (error) {
    console.error('File extraction error:', error);
    return res.status(500).json({ 
      error: 'Failed to extract resume content',
      message: error.message 
    });
  }
};

