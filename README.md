# JobBoard Pro 🚀

A modern, full-featured job board application built with React, Supabase, and AI-powered resume builder. Perfect for companies looking to create their own job posting platform.

## ✨ Features

### 🌐 Public Features
- **Job Browsing**: Browse and search thousands of jobs
- **Advanced Filtering**: Filter by category, location, type, salary range
- **Job Details**: Comprehensive job descriptions with company info
- **Easy Application**: Apply for jobs without login (just name and email)
- **AI Resume Builder**: Generate professional resumes with AI assistance
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Fast & Modern**: Built with React 18 and Vite for lightning-fast performance

### 🔐 Admin Features
- **Dashboard**: Analytics and statistics at a glance
- **Job Management**: Create, edit, delete, and feature jobs
- **Application Management**: Review and manage all applications
- **Bulk Actions**: Perform actions on multiple jobs at once
- **Real-time Updates**: See changes instantly with Supabase

### 🤖 AI-Powered Resume Builder
- **AI Generation**: Create professional resume content using OpenAI
- **File Upload**: Upload existing resumes (PDF/DOCX)
- **Live Preview**: See your resume as you build it
- **PDF Export**: Download professional PDF resumes
- **Step-by-Step**: Guided 6-step process for easy resume creation

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS
- **Backend**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-3.5-turbo
- **Deployment**: Vercel
- **Authentication**: Supabase Auth (Admin only)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js (v16.x or higher)
- npm or yarn
- Supabase account (free tier works)
- OpenAI API key (for resume builder)
- Vercel account (for deployment)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd jobboard_pro
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the `jobboard_pro` directory:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-openai-key
PORT=3001
```

See `ENV_SETUP.md` for detailed instructions on getting these values.

### 3. Set Up Database

1. Go to your Supabase project
2. Open the SQL Editor
3. Run the SQL script from `database_update.sql`

This creates all tables, security policies, and sample data.

### 4. Create Admin User

1. In Supabase, go to Authentication → Users
2. Click "Add User" → "Create new user"
3. Enter email and password
4. Check "Auto Confirm User"
5. Click "Create user"

### 5. Run the Application

```bash
npm run dev
```

Visit http://localhost:4028

## 📁 Project Structure

```
jobboard_pro/
├── api/                        # Vercel serverless functions
│   ├── generate-resume.js      # AI resume generation
│   └── extract-resume.js       # Resume upload extraction
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── ProtectedRoute.jsx  # Admin route protection
│   │   └── ...
│   ├── config/
│   │   └── supabase.js         # Supabase configuration
│   ├── lib/
│   │   ├── database.js         # Database API layer
│   │   └── supabase.js         # Supabase client
│   ├── pages/
│   │   ├── home-page/          # Homepage with jobs
│   │   ├── job-search-results/ # Job search & filters
│   │   ├── job-detail-view/    # Individual job details
│   │   ├── job-categories/     # Browse by category
│   │   ├── resume-builder/     # AI resume builder
│   │   ├── admin-login/        # Admin authentication
│   │   ├── admin-dashboard/    # Admin analytics
│   │   └── admin-job-management/ # Job CRUD operations
│   ├── styles/                 # Global styles
│   ├── utils/                  # Utility functions
│   ├── App.jsx                 # Main app component
│   ├── Routes.jsx              # Application routes
│   └── index.jsx               # Entry point
├── database_update.sql         # Database schema
├── vercel.json                 # Vercel configuration
├── package.json                # Dependencies
├── SETUP_INSTRUCTIONS.md       # Detailed setup guide
└── DEPLOYMENT_GUIDE.md         # Deployment instructions
```

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy!

See `DEPLOYMENT_GUIDE.md` for complete step-by-step instructions.

## 📖 Documentation

- **SETUP_INSTRUCTIONS.md** - Complete setup guide with troubleshooting
- **DEPLOYMENT_GUIDE.md** - Vercel deployment walkthrough
- **ENV_SETUP.md** - Environment variables guide
- **DATABASE_SETUP.md** - Database configuration details
- **AI_RESUME_BUILDER_README.md** - Resume builder documentation

## 🎯 Usage

### For Job Seekers
1. Visit the homepage
2. Browse jobs or search by keywords
3. Filter by category, location, or salary
4. Click on a job to view details
5. Apply with name, email, and resume
6. Use AI Resume Builder to create a professional resume

### For Administrators
1. Go to `/admin-login`
2. Login with admin credentials
3. View dashboard analytics
4. Manage jobs (create, edit, delete, feature)
5. Review applications
6. Export data

## 🔒 Security

- **Row Level Security (RLS)**: Enabled on all Supabase tables
- **Admin-Only Access**: Protected routes for admin features
- **Environment Variables**: Sensitive data stored securely
- **No User Registration**: Public users don't need accounts
- **Secure Authentication**: Supabase Auth for admins

## 🎨 Customization

### Change Company Name
Edit `src/components/ui/GlobalHeader.jsx`:
```jsx
<span>Your Company Name</span>
```

### Update Colors
Edit `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      // ...
    }
  }
}
```

### Add Custom Logo
Replace `public/favicon.ico` with your logo

## 📊 Database Schema

- **jobs**: Job postings with all details
- **companies**: Company information
- **job_applications**: Job applications from candidates
- **categories**: Job categories
- **users**: Admin users (for authentication)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check `SETUP_INSTRUCTIONS.md` for troubleshooting
- Review `DEPLOYMENT_GUIDE.md` for deployment issues
- Open an issue on GitHub

## 🎉 Acknowledgments

- Built with React and Vite
- Powered by Supabase
- AI by OpenAI
- Deployed on Vercel
- Icons by Lucide
- Animations by Framer Motion

---

**Ready to launch your job board?** Follow the setup instructions and deploy to Vercel in minutes!

Built with ❤️ for modern recruiting
