🚀 AI Career & Job Assistant

An AI-powered career companion designed to help students and job seekers build better resumes, understand their career direction, discover relevant opportunities, and create a personalized learning path.

The idea behind this project is simple: instead of using separate tools for resumes, career advice, job searching, and interview preparation, bring the most useful parts of the job-search journey into one platform.

---

✨ What is this project?

Finding the right career path can be confusing.

You may have a resume but not know how strong it is. You may have skills but not know which roles fit you. You may know what career you want but not know what to learn next.

This project brings those pieces together using AI + personalized user data.

The application allows users to:

- Create and manage their profile
- Build and analyze resumes
- Get AI-powered career recommendations
- Explore job matches
- Follow a personalized learning roadmap
- Practice interviews with AI
- Manage account settings securely

---

🎯 Main Features

👤 My Profile

Users can create and maintain their professional profile, including:

- Full name
- Education
- Skills
- Experience
- Career goal
- Bio

The profile information is used to provide more personalized career recommendations.

---

📄 AI Resume Builder

The Resume Builder allows users to create and improve their resume.

Features include:

- Resume form
- Live resume preview
- PDF generation
- Resume data management
- PDF/DOCX resume upload
- AI-powered resume analysis
- Resume score
- Strengths and weaknesses
- Improvement suggestions
- Skill recommendations

The resume analysis is handled by the backend so that the AI integration and API keys remain outside the frontend.

---

🤖 AI Career Advisor

The Career Advisor uses Gemini to provide personalized career guidance based on the user's profile.

The goal is to help answer questions such as:

- Which career direction fits my skills?
- Which roles should I consider?
- What skills should I improve?
- What should I focus on next?

The recommendations are based on the user's actual profile instead of being completely generic.

---

💼 Job Matches

The Job Matches section is designed to connect users with relevant career opportunities based on their:

- Skills
- Career goals
- Experience
- Preferred roles

The project structure also allows the job-data source to be replaced or expanded later without changing the entire frontend.

---

📚 Learning Roadmap

The Learning Roadmap helps users understand what they should learn next.

Instead of simply showing a list of technologies, the roadmap is designed around a career goal.

For example:

Career Goal
     ↓
Required Skills
     ↓
Learning Topics
     ↓
Practice
     ↓
Career Readiness

The roadmap can also be enhanced through Gemini to generate more personalized learning recommendations.

---

🎤 Interview Prep

Interview Prep is designed to provide an AI-powered practice environment.

The planned flow is:

Select Job Role
      ↓
Select Interview Type
      ↓
Start Interview
      ↓
AI Generates Question
      ↓
User Answers
      ↓
AI Gives Feedback
      ↓
Next Question

Interview types include:

- Technical
- Behavioral
- Mixed

The Gemini integration for this feature is currently being refined.

---

⚙️ Settings

The Settings page provides a central place for managing account-related preferences.

It is connected with the application's Supabase authentication system.

---

🔐 Authentication

Authentication is handled using Supabase Auth.

The application supports:

- User registration
- Login
- Email confirmation
- Authenticated sessions
- Protected dashboard routes
- Logout
- User-specific data

Sensitive credentials such as API keys are stored in environment variables rather than being hard-coded into the application.

---

🛠️ Tech Stack

Frontend

- React
- React Router
- CSS
- JavaScript
- HTML
- Fetch API

Backend

- Node.js
- Express.js
- CORS
- dotenv
- Multer

Database & Authentication

- Supabase
- PostgreSQL
- Supabase Authentication
- Row Level Security (RLS)

AI

- Google Gemini
- "@google/genai"

Resume Processing

- PDF parsing
- DOCX text extraction
- "mammoth"
- "pdf-parse"

Resume Export

- "html2canvas"
- "jsPDF"

---

🏗️ Project Architecture

The project follows a separate frontend/backend structure:

AI-Career-Assistant/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── ResumeBuilder.jsx
│   │   │   ├── CareerAdvisor.jsx
│   │   │   ├── JobMatches.jsx
│   │   │   ├── LearningRoadmap.jsx
│   │   │   ├── InterviewPrep.jsx
│   │   │   └── Settings.jsx
│   │   │
│   │   ├── styles/
│   │   ├── supabaseClient.js
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server/
│   ├── routes/
│   │   └── aiRoutes.js
│   │
│   ├── supabase.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md

The exact folder names may vary depending on the current project structure.

---

🔄 How the Application Works

The general application flow is:

User
 │
 ▼
React Frontend
 │
 ├── Profile
 ├── Resume Builder
 ├── Career Advisor
 ├── Job Matches
 ├── Learning Roadmap
 └── Interview Prep
 │
 ▼
Node.js + Express Backend
 │
 ├── AI Routes
 ├── Resume Processing
 └── Supabase Communication
 │
 ├───────────────┐
 ▼               ▼
Supabase       Gemini AI
 │               │
 ▼               ▼
User Data      AI Results

This separation keeps the frontend focused on the user experience while the backend handles AI requests, file processing, and database communication.

---

🔑 Environment Variables

Create a ".env" file in the appropriate project directories.

Frontend

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

Backend

PORT=5000

SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

GEMINI_API_KEY=your_gemini_api_key

«Never commit real API keys or service-role keys to GitHub.»

Add ".env" to ".gitignore".

---

⚙️ Installation

Clone the repository:

git clone https://github.com/saimanadeem5467-pixel/ai-career-job-assistant.git

Move into the project:

cd AI-Career-Assistant

Install frontend dependencies:

cd client
npm install

Install backend dependencies:

cd ../server
npm install

---

▶️ Running the Project

You need two terminals.

Terminal 1 — Backend

cd server
npm run dev

The backend should run on:

http://localhost:5000

Terminal 2 — Frontend

cd client
npm run dev

Vite will provide the frontend development URL, usually:

http://localhost:5173

---

🔌 Backend API

Some of the main backend endpoints include:

GET  /
GET  /api/test-supabase

POST /api/ai/analyze-resume
POST /api/ai/interview

The AI routes are mounted through:

/api/ai

For example:

POST /api/ai/analyze-resume

The backend receives the uploaded resume, extracts the content, sends relevant information to Gemini, and returns the analysis to the React application.

---

🗄️ Supabase

Supabase is used for both authentication and application data.

The project uses PostgreSQL tables for user-related information and application data.

Important security considerations include:

- Row Level Security
- User-specific records
- Authenticated access
- Protected database operations

For production, RLS policies should be carefully reviewed before deployment.

---

🔒 Security

This project follows several basic security practices:

- API keys are stored in environment variables.
- Gemini requests are handled through the backend.
- Supabase authentication handles user sessions.
- Protected frontend routes prevent unauthenticated dashboard access.
- Database access can be restricted using Supabase RLS.
- Service-role credentials should never be exposed to the frontend.

---

📱 User Experience

The interface follows a modern SaaS-style dashboard design with:

- Dark dashboard UI
- Sidebar navigation
- Rounded cards
- AI-focused visual elements
- Responsive layouts
- Clear page separation
- Career progress indicators
- Consistent purple/blue accent colors

The goal is not just to make the application functional, but to make it feel like a real career product rather than a collection of separate demo pages.

---

🧭 Current Development Status

Feature| Status
Authentication| ✅ Working
Supabase integration| ✅ Working
Dashboard| ✅ Working
My Profile| ✅ Working
Resume Builder| ✅ Working
Resume AI Analysis| ✅ Integrated
AI Career Advisor| ✅ Integrated
Job Matches| 🟡 Implemented / being refined
Learning Roadmap| ✅ Integrated with AI
Interview Prep UI| ✅ Working
Interview Prep Gemini| 🟡 In progress
Settings| ✅ Implemented
Production deployment| ⏳ Next step

---

🚧 Future Improvements

There are several directions this project can grow in:

AI Improvements

- Better resume scoring
- More accurate job matching
- Personalized interview feedback
- AI-generated learning resources
- Career progression predictions
- Improved prompt engineering

Product Improvements

- Saved jobs
- Application tracking
- Resume templates
- Multiple resumes
- Job alerts
- Interview history
- Progress tracking
- Profile recommendations

Technical Improvements

- Better API error handling
- Loading and empty states
- Backend validation
- Rate limiting
- Improved security policies
- Automated testing
- Production logging
- Deployment optimization

---

💡 Why I Built This

I built this project to go beyond creating another basic CRUD application.

A lot of career platforms provide information, but the information can feel disconnected. You might find a job in one place, build your resume somewhere else, learn from another platform, and prepare for interviews somewhere completely different.

I wanted to explore whether AI could connect those steps into one experience.

This project also gave me practical experience working across the full stack — from React interfaces and authentication to Express APIs, PostgreSQL/Supabase, file processing, and AI integration.

---

📖 What I Learned

Working on this project helped me understand:

- Building a React application with multiple routes
- Creating reusable UI components
- Managing authentication with Supabase
- Connecting React to an Express backend
- Building REST API endpoints
- Handling file uploads
- Extracting text from PDF and DOCX files
- Integrating Gemini AI
- Working with environment variables
- Using PostgreSQL through Supabase
- Understanding Row Level Security
- Debugging frontend/backend communication
- Designing a SaaS-style dashboard
- Connecting AI output to real application features

---

🚀 Future Vision

The long-term goal is to turn this project into a complete AI career companion.

Instead of simply telling users what jobs exist, the application should understand where a user currently is, where they want to go, and what they need to do next.

Your Current Skills
        ↓
     AI Analysis
        ↓
Career Direction
        ↓
   Job Matches
        ↓
Learning Roadmap
        ↓
Resume Improvement
        ↓
Interview Practice
        ↓
     Career Ready 🚀

---

👨‍💻 Author

Built as a full-stack AI career project to explore modern web development, AI integration, and real-world product development.

If you find the project useful or have suggestions, feel free to open an issue or start a discussion.

---

⭐ If you like this project

Consider giving the repository a ⭐ on GitHub.

Feedback, suggestions, and contributions are welcome.
