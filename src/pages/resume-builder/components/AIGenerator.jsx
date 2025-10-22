import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AIGenerator = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState({
    role: '',
    years: '',
    industry: '',
    keySkills: '',
    achievements: ''
  });

  const [generatedContent, setGeneratedContent] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setPrompt(prev => ({ ...prev, [field]: value }));
  };

  const generateWithAI = async () => {
    if (!prompt.role || !prompt.years) {
      alert('Please fill in at least the role and years of experience.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: prompt.role,
          years: prompt.years,
          industry: prompt.industry,
          keySkills: prompt.keySkills,
          achievements: prompt.achievements
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data);
      onGenerate(data);
    } catch (error) {
      console.error('AI generation failed:', error);
      // Fallback to mock data for demo
      const mockData = {
        summary: `Experienced ${prompt.role || 'professional'} with ${prompt.years || '5'} years of expertise in ${prompt.industry || 'technology'}. Proven track record of delivering high-quality solutions and driving business growth through innovative approaches.`,
        experience: [
          {
            title: 'Senior ' + (prompt.role || 'Developer'),
            company: 'Tech Company',
            location: 'Remote',
            startDate: '2022-01',
            endDate: 'Present',
            description: 'Led development of key features and mentored junior team members.'
          }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git']
      };
      setGeneratedContent(mockData);
      onGenerate(mockData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Icon name="Sparkles" size={48} className="text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          AI-Powered Resume Generation
        </h3>
        <p className="text-text-secondary">
          Let AI help you create compelling resume content based on your experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Target Role"
          value={prompt.role}
          onChange={(e) => handleInputChange('role', e.target.value)}
          placeholder="e.g., Senior Software Engineer"
          required
        />
        <Input
          label="Years of Experience"
          value={prompt.years}
          onChange={(e) => handleInputChange('years', e.target.value)}
          placeholder="e.g., 5"
          required
        />
        <Input
          label="Industry"
          value={prompt.industry}
          onChange={(e) => handleInputChange('industry', e.target.value)}
          placeholder="e.g., Technology, Finance, Healthcare"
        />
        <Input
          label="Key Skills"
          value={prompt.keySkills}
          onChange={(e) => handleInputChange('keySkills', e.target.value)}
          placeholder="e.g., React, Node.js, Python, AWS"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Key Achievements (Optional)
        </label>
        <textarea
          value={prompt.achievements}
          onChange={(e) => handleInputChange('achievements', e.target.value)}
          placeholder="Describe your key achievements, projects, or accomplishments..."
          className="w-full h-32 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div className="text-center">
        <Button
          onClick={generateWithAI}
          loading={loading}
          disabled={!prompt.role || !prompt.years}
          iconName="Sparkles"
          size="lg"
        >
          {loading ? 'Generating...' : 'Generate with AI'}
        </Button>
      </div>

      {generatedContent && (
        <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-lg">
          <h4 className="text-lg font-semibold text-foreground mb-4">Generated Content</h4>
          
          <div className="space-y-4">
            <div>
              <h5 className="font-medium text-foreground mb-2">Professional Summary</h5>
              <p className="text-text-secondary">{generatedContent.summary}</p>
            </div>

            {generatedContent.experience && generatedContent.experience.length > 0 && (
              <div>
                <h5 className="font-medium text-foreground mb-2">Sample Experience</h5>
                {generatedContent.experience.map((exp, index) => (
                  <div key={index} className="mb-3 p-3 bg-surface rounded border">
                    <div className="font-medium">{exp.title}</div>
                    <div className="text-sm text-text-secondary">{exp.company} • {exp.location}</div>
                    <div className="text-sm text-text-secondary">{exp.startDate} - {exp.endDate}</div>
                    <div className="text-sm mt-2">{exp.description}</div>
                  </div>
                ))}
              </div>
            )}

            {generatedContent.skills && generatedContent.skills.length > 0 && (
              <div>
                <h5 className="font-medium text-foreground mb-2">Suggested Skills</h5>
                <div className="flex flex-wrap gap-2">
                  {generatedContent.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIGenerator; 