# Resume Job Matcher - Setup Guide

## Overview

The Resume Job Matcher is an AI-powered feature that allows users to upload their resume and get matched with relevant tech jobs based on their skills, experience, and education. It uses Google's Gemini AI for intelligent parsing and matching.

## Features

✨ **AI-Powered Resume Parsing** - Extracts skills, experience, education, and contact info from PDF/DOCX resumes  
🎯 **Smart Job Matching** - Scores jobs 0-100% based on skill overlap, experience level, and relevance  
📊 **Match Insights** - Shows which skills match and why each job is a good fit  
🚀 **No Login Required** - Users can upload and match without creating an account  
⚡ **Fast Results** - Top 5 matches displayed instantly, with option to view all  
🔒 **Privacy First** - No data is stored on servers, session-only matching  

---

## Installation Steps

### 1. Install Required Dependencies

Run this command in your project directory:

```bash
npm install @google/generative-ai pdfjs-dist mammoth
```

**Packages:**
- `@google/generative-ai` - Google Gemini AI SDK
- `pdfjs-dist` - PDF parsing library
- `mammoth` - DOCX parsing library

### 2. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the API key (starts with `AIza...`)

**Pricing:**
- **Free Tier**: 60 requests/minute (perfect for testing)
- **After Free Tier**: $0.15 per 1 million tokens (very affordable)

### 3. Configure Environment Variables

Create a `.env` file in your project root if it doesn't exist:

```bash
# Supabase Configuration (existing)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini AI Configuration (NEW)
VITE_GEMINI_API_KEY=AIzaSyC...your-api-key-here
```

⚠️ **Important**: 
- Never commit the `.env` file to version control
- Add `.env` to your `.gitignore` file
- The API key must start with `VITE_` to be accessible in Vite

### 4. Enable Resume Builder

In `src/pages/resume-builder/index.jsx`, change line 12:

```javascript
// Change this:
const isResumeBuilderEnabled = false;

// To this:
const isResumeBuilderEnabled = true;
```

---

## How It Works

### User Journey

1. **Navigate to Resume Builder** → User goes to `/resume-builder`
2. **Click "Find Matching Jobs"** → Opens the job matcher interface
3. **Upload Resume** → Drag-and-drop or click to upload PDF/DOCX (max 5MB)
4. **AI Processing** → System:
   - Extracts text from file
   - Gemini AI parses resume data (skills, experience, education)
   - Fetches tech jobs from database
   - Gemini AI scores each job against resume
5. **View Results** → Top 5 matches displayed with:
   - Match score (0-100%)
   - Matching skills highlighted
   - AI-generated reason for match
6. **View All Matches** → Click button to see full results on search page

### Technical Flow

```
Resume Upload
    ↓
PDF/DOCX → Text Extraction (pdfTextExtractor.js)
    ↓
Text → Gemini AI Parsing (geminiParser.js)
    ↓
Structured Data: { name, email, skills[], experience, education[] }
    ↓
Fetch Tech Jobs from Supabase
    ↓
Job List + Resume Data → Gemini AI Matching
    ↓
Scored Jobs: [{ job, matchScore, matchingSkills, reason }]
    ↓
Display Top 5 + "View All" Option
```

---

## File Structure

### New Files Created

```
src/
├── lib/
│   └── geminiParser.js          # Gemini AI integration for parsing & matching
├── utils/
│   └── pdfTextExtractor.js      # PDF/DOCX text extraction
├── pages/
│   └── resume-builder/
│       └── components/
│           ├── JobMatcherView.jsx    # Main matcher interface
│           └── JobMatchCard.jsx      # Individual job match display
└── styles/
    └── job-matcher.css          # Dedicated styles for matcher UI
```

### Modified Files

```
src/
├── pages/
│   ├── resume-builder/
│   │   ├── index.jsx            # Added job-matcher view state
│   │   └── components/
│   │       └── ResumeDashboard.jsx  # Added "Find Matching Jobs" card
│   └── job-search-results/
│       └── index.jsx            # Added matcher query param support
└── styles/
    └── tailwind.css             # Imported job-matcher.css
```

---

## Usage Examples

### Basic Usage

```javascript
// User uploads resume.pdf
// System extracts:
{
  name: "John Doe",
  email: "john@example.com",
  skills: ["React", "Node.js", "Python", "AWS"],
  totalExperience: 3,
  jobTitles: ["Software Engineer", "Developer"],
  education: ["B.S. Computer Science"]
}

// Matched jobs:
[
  {
    title: "Senior React Developer",
    matchScore: 92,
    matchingSkills: ["React", "Node.js", "AWS"],
    matchReason: "Strong match: 3 of your key skills align with requirements"
  },
  {
    title: "Full Stack Engineer",
    matchScore: 85,
    matchingSkills: ["React", "Node.js"],
    matchReason: "Good experience level fit and technology stack match"
  }
]
```

### Programmatic Usage

```javascript
import { parseResumeWithGemini, matchJobsWithGemini } from './lib/geminiParser';
import { extractTextFromResume } from './utils/pdfTextExtractor';

// Extract and parse resume
const text = await extractTextFromResume(file);
const resumeData = await parseResumeWithGemini(text);

// Match jobs
const { data: jobs } = await jobsApi.getJobs({ categories: ['Technology'] });
const matches = await matchJobsWithGemini(resumeData, jobs);

console.log(matches[0].matchScore); // 92
```

---

## Rate Limiting

### Built-in Protection

The system includes rate limiting to prevent abuse:

- **Limit**: 5 resume uploads per hour per session
- **Window**: Rolling 1-hour window
- **Storage**: In-memory (resets on server restart)
- **Error Message**: "Rate limit exceeded. Please try again in X minutes."

### Gemini API Limits

**Free Tier:**
- 60 requests per minute
- 1,500 requests per day

**Pricing After Free Tier:**
- Gemini 1.5 Flash: $0.075 / 1M input tokens, $0.30 / 1M output tokens
- Average cost per resume match: ~$0.002 (very affordable!)

---

## Troubleshooting

### Common Issues

#### 1. "Gemini API key not configured"

**Solution:**
- Check that `.env` file exists in project root
- Verify `VITE_GEMINI_API_KEY` is set correctly
- Restart development server after adding env variables
- Ensure key starts with `VITE_` prefix

#### 2. "Failed to extract text from PDF"

**Solution:**
- Ensure PDF is not password-protected
- Check file size is under 5MB
- Try converting PDF to a different format and back
- Some scanned PDFs may not have text layer (use OCR tools first)

#### 3. "Rate limit exceeded"

**Solution:**
- Wait for the specified time (shown in error message)
- Increase `MAX_REQUESTS_PER_HOUR` in `geminiParser.js` if needed
- For production, consider implementing user-based rate limiting

#### 4. Resume builder shows "Coming Soon"

**Solution:**
- Enable resume builder in `src/pages/resume-builder/index.jsx`
- Set `isResumeBuilderEnabled = true`

#### 5. No jobs found after matching

**Solution:**
- Verify jobs exist in database with categories: Technology, Development, IT, or Software
- Check Supabase connection is working
- Review browser console for API errors

---

## Customization

### Adjust Matching Algorithm

Edit `src/lib/geminiParser.js`, function `matchJobsWithGemini()`:

```javascript
// Change scoring weights in the prompt
Score based on: 
- skill overlap (60%)      // ← Adjust these percentages
- experience level (20%)
- category relevance (10%)
- job freshness (10%)
```

### Change Rate Limits

Edit `src/lib/geminiParser.js`:

```javascript
const MAX_REQUESTS_PER_HOUR = 5;  // Change to 10, 20, etc.
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;  // 1 hour in ms
```

### Modify Supported File Types

Edit `src/utils/pdfTextExtractor.js`:

```javascript
const ALLOWED_TYPES = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  // Add more types here
};
```

### Customize UI Styles

Edit `src/styles/job-matcher.css` to change:
- Colors and gradients
- Animations and transitions
- Card layouts
- Mobile responsiveness

---

## Security Best Practices

### ✅ Do's

- Store API keys in environment variables only
- Add `.env` to `.gitignore`
- Use rate limiting to prevent abuse
- Validate file types and sizes before processing
- Sanitize extracted text before sending to AI
- Use HTTPS in production

### ❌ Don'ts

- Never commit API keys to version control
- Don't expose API keys in client-side code (use serverless functions in production)
- Don't store user resume data on servers
- Don't allow unlimited file uploads
- Don't skip file validation

---

## Production Deployment

### Recommended Approach: Serverless Functions

For production, move Gemini API calls to serverless functions to hide API keys:

```javascript
// api/parse-resume.js (Vercel/Netlify serverless function)
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Server-side only
  // ... parsing logic
};
```

### Environment Variables on Vercel

1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add: `GEMINI_API_KEY` (without `VITE_` prefix for server-side)
3. Redeploy

---

## Performance Optimization

### Client-Side Caching

```javascript
// Cache job data for 5 minutes
const jobCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
  return cached.data;
}
```

### Limit Jobs Processed

The matcher already limits to top 20 jobs for efficiency:

```javascript
const jobsToMatch = jobs.slice(0, 20); // Only process 20 jobs max
```

### Show Progress Indicators

The UI already includes:
- Upload progress
- Processing status messages
- Progress bar (0-100%)
- Loading spinners

---

## Testing

### Test Resume Upload

1. Navigate to `/resume-builder`
2. Click "Find Matching Jobs"
3. Upload a sample resume (PDF or DOCX)
4. Verify AI extracts skills correctly
5. Check match scores and reasons

### Test Cases

- ✅ Upload valid PDF resume
- ✅ Upload valid DOCX resume
- ✅ Upload file over 5MB (should fail)
- ✅ Upload invalid file type (should fail)
- ✅ Upload 6 resumes in quick succession (6th should be rate-limited)
- ✅ View matched jobs
- ✅ Click "View All Matches"
- ✅ Navigate between resume builder and matcher

---

## Support & Resources

### Documentation

- [Gemini API Docs](https://ai.google.dev/docs)
- [PDF.js Documentation](https://mozilla.github.io/pdf.js/)
- [Mammoth.js Documentation](https://github.com/mwilliamson/mammoth.js)

### Getting Help

If you encounter issues:

1. Check browser console for errors
2. Verify API key is configured correctly
3. Review network tab for failed requests
4. Check Gemini API quota/usage at [Google AI Studio](https://makersuite.google.com/)

---

## Future Enhancements

Potential improvements:

- 🔐 Add user authentication to save match history
- 📊 Analytics dashboard for admin (most matched skills, etc.)
- 🎨 Multiple resume templates support
- 📧 Email notifications for new matching jobs
- 🌐 Multi-language support
- 🤖 More advanced AI matching (semantic similarity, embeddings)
- 💾 Option to save resume data (with user consent)
- 📱 Mobile app version

---

## License & Credits

Built with:
- **Google Gemini AI** - Resume parsing and job matching
- **PDF.js** - Mozilla's PDF rendering library
- **Mammoth.js** - DOCX text extraction
- **React** - UI framework
- **Tailwind CSS** - Styling
- **Supabase** - Database

---

**Happy Job Matching! 🎉**

