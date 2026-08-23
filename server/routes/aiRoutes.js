const express = require("express");
const multer = require("multer");
const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
router.get("/test",(req,res)=>{
  console.log ("AI ROUTE IS WORKING");
  res.json({
    success:true,
    message:"ai route is working",
  });
});

// ==========================================
// RESUME ANALYZER
// ==========================================

router.post(
  "/analyze-resume",
  upload.single("resume"),
  async (req, res) => {
    try {
      console.log("1. Resume request received");

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a PDF or DOCX resume.",
        });
      }

      console.log("2. File:", req.file.originalname);

      let resumeText = "";

      // PDF
      if (req.file.mimetype === "application/pdf") {
        const parser = new PDFParse({
          data: req.file.buffer,
        });

        const result = await parser.getText();

        resumeText = result.text;

        await parser.destroy();
      }

      // DOCX
      else if (
        req.file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const result = await mammoth.extractRawText({
          buffer: req.file.buffer,
        });

        resumeText = result.value;
      }

      // DOC
      else if (req.file.mimetype === "application/msword") {
        return res.status(400).json({
          success: false,
          message:
            "DOC files are not supported. Please upload PDF or DOCX.",
        });
      }

      // Other files
      else {
        return res.status(400).json({
          success: false,
          message:
            "Unsupported file type. Please upload PDF or DOCX.",
        });
      }

      if (!resumeText.trim()) {
        return res.status(400).json({
          success: false,
          message: "Could not extract text from this resume.",
        });
      }

      console.log("3. Resume text extracted");
      console.log("4. Sending resume to Gemini");

      const prompt = `
You are an expert AI Resume Analyzer.

Analyze the resume below.

RESUME:
${resumeText}

Return a professional analysis with these sections:

1. Resume Score
Give a score from 0 to 100.

2. Strengths
Identify the strongest parts of the resume.

3. Weaknesses
Identify weaknesses and missing information.

4. Grammar & Writing
Identify grammar, spelling, clarity and wording problems.

5. Important Skills
Suggest important technical and professional skills based on the candidate's background.

6. ATS Suggestions
Suggest keywords and improvements for ATS systems.

7. Career Suggestions
Suggest suitable career directions and improvements.

8. Improvement Plan
Give practical steps the candidate should take to improve the resume.

Base everything on the actual resume.
Do not invent experience or qualifications.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      console.log("5. Gemini response received");

      res.json({
        success: true,
        analysis: response.text,
      });
    } catch (error) {
      console.error("RESUME AI ERROR:", error);

      res.status(500).json({
        success: false,
        message: error.message || "Resume analysis failed.",
      });
    }
  }
);
// AI Interview Prep
router.post("/interview", async (req, res) => {
  try {
    const { role, interviewType, answer, action } = req.body;

    console.log("================================");
    console.log("INTERVIEW REQUEST");
    console.log("Role:", role);
    console.log("Type:", interviewType);
    console.log("Action:", action);
    console.log("================================");

    if (!role || !interviewType) {
      return res.status(400).json({
        success: false,
        message: "Role and interview type are required.",
      });
    }

    let prompt = "";

    if (action === "start") {
      prompt = `
You are an AI interview coach.

Target role: ${role}
Interview type: ${interviewType}

Generate ONE interview question for this candidate.

Rules:
- Ask exactly ONE question.
- Make it appropriate for the target role.
- Technical: ask a technical question.
- Behavioral: ask about teamwork, communication, experience, or problem solving.
- Mixed: ask an appropriate interview question.
- Do not provide an answer.
- Return ONLY the question.
`;
    }

    else if (action === "answer") {
      if (!answer) {
        return res.status(400).json({
          success: false,
          message: "Answer is required.",
        });
      }

      prompt = `
You are an AI interview coach.

Target role: ${role}
Interview type: ${interviewType}

Candidate answer:
${answer}

Evaluate the candidate's answer.

Return exactly:

FEEDBACK:
Give short useful feedback.

STRENGTH:
Mention one strength.

IMPROVEMENT:
Mention one improvement.

SCORE:
Give a score from 1 to 10.

NEXT QUESTION:
Ask exactly ONE new interview question.
`;
    }

    else {
      return res.status(400).json({
        success: false,
        message: "Invalid interview action.",
      });
    }

    console.log("Sending prompt to Gemini...");

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    console.log("RAW GEMINI RESPONSE:");
    console.log(response);

    const text =
      typeof response.text === "function"
        ? response.text()
        : response.text;

    console.log("GEMINI TEXT:");
    console.log(text);

    if (!text || !text.trim()) {
      return res.status(500).json({
        success: false,
        message: "Gemini returned an empty response.",
      });
    }

    return res.json({
      success: true,
      result: text.trim(),
    });

  } catch (error) {
    console.error("================================");
    console.error("INTERVIEW AI ERROR");
    console.error(error);
    console.error("MESSAGE:", error.message);
    console.error("================================");

    return res.status(500).json({
      success: false,
      message: error.message || "AI interview failed.",
    });
  }
});

// ==========================================
// CAREER ADVICE
// ==========================================

router.post("/career-advice", async (req, res) => {
  try {
    const { question, profile } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const prompt = `
You are an AI Career Advisor.

User profile:
Education: ${profile?.education || "Not provided"}
Skills: ${profile?.skills || "Not provided"}
Experience: ${profile?.experience || "Not provided"}
Career Goal: ${profile?.career_goal || "Not provided"}
Bio: ${profile?.bio || "Not provided"}

User question:
${question}

Give practical and personalized career advice.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({
      success: true,
      answer: response.text,
    });
  } catch (error) {
    console.error("Career Advice Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "AI request failed",
    });
  }
});
router.post("/learning-roadmap", async (req, res) => {
  try {
    const { targetRole, currentSkills } = req.body;

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message: "Target career is required",
      });
    }

    console.log("Learning roadmap request received");
    console.log("Target role:", targetRole);
    console.log("Current skills:", currentSkills);

    const prompt = `
You are an expert AI career mentor.

Create a personalized learning roadmap for the user.

Target career:
${targetRole}

Current skills:
${currentSkills || "Not provided"}

Analyze the gap between the user's current skills
and the target career.

Create a practical roadmap with 4 to 6 learning steps.

For each step provide:
- title
- description
- skills
- priority (High, Medium, or Low)
- duration

Also provide:
- a short summary
- the most important next step

Return ONLY valid JSON.

Use exactly this structure:

{
  "summary": "short overview",
  "steps": [
    {
      "title": "step title",
      "description": "what the user should learn",
      "skills": ["skill 1", "skill 2"],
      "priority": "High",
      "duration": "2 weeks"
    }
  ],
  "nextStep": "the most important thing the user should do next"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    let text = response.text;

    console.log("Gemini roadmap response received");

    // Remove possible markdown code fences
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let roadmap;

    try {
      roadmap = JSON.parse(text);
    } catch (parseError) {
      console.error(
        "Gemini JSON parsing error:",
        parseError
      );

      console.error("Gemini returned:", text);

      return res.status(500).json({
        success: false,
        message: "AI returned invalid roadmap data",
      });
    }

    return res.json({
      success: true,
      roadmap,
    });

  } catch (error) {
    console.error(
      "Learning Roadmap AI Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate learning roadmap",
    });
  }
});

module.exports = router;