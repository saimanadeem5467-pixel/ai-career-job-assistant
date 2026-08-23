import { useRef, useState } from "react";
import {
  Upload,
  FileText,
  Sparkles,
  Download,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import "./ResumeBuilder.css";

function ResumeBuilder() {
  // ==========================================
  // RESUME DATA
  // ==========================================

  const [resume, setResume] = useState({
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    education: "",
    experience: "",
    skills: "",
    projects: "",
  });

  // ==========================================
  // AI / UPLOAD STATE
  // ==========================================

  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  // ==========================================
  // HANDLE FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setResume((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // VALIDATE FILE
  // ==========================================

  const validateFile = (file) => {
    if (!file) {
      return false;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    const allowedExtensions = [".pdf", ".doc", ".docx"];

    const fileName = file.name.toLowerCase();

    const validExtension = allowedExtensions.some((extension) =>
      fileName.endsWith(extension)
    );

    const validMimeType = allowedTypes.includes(file.type);

    return validExtension || validMimeType;
  };

  // ==========================================
  // SELECT FILE
  // ==========================================

  const handleFileSelect = (file) => {
    setError("");

    if (!file) {
      return;
    }

    if (!validateFile(file)) {
      setSelectedFile(null);

      setError(
        "Please upload a PDF, DOC, or DOCX resume."
      );

      return;
    }

    // Optional file size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      setSelectedFile(null);

      setError(
        "File is too large. Please upload a file smaller than 10MB."
      );

      return;
    }

    setSelectedFile(file);

    // Clear previous analysis
    setAnalysis("");
  };

  // ==========================================
  // FILE INPUT
  // ==========================================

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];

    handleFileSelect(file);
  };

  // ==========================================
  // DRAG EVENTS
  // ==========================================

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    const file = e.dataTransfer.files?.[0];

    handleFileSelect(file);
  };

  // ==========================================
  // REMOVE FILE
  // ==========================================

  const removeFile = () => {
    setSelectedFile(null);
    setAnalysis("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ==========================================
  // AI RESUME ANALYSIS
  // ==========================================

  const analyzeResume = async (file) => {
    if (!file) {
      setError("Please select a resume first.");
      return;
    }

    setError("");
    setIsAnalyzing(true);
    setAnalysis("");

    const formData = new FormData();

    formData.append("resume", file);

    try {
      console.log("Sending resume to backend...");

      const response = await fetch(
        "http://localhost:5000/api/ai/analyze-resume",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      console.log(
        "AI Resume Analysis Result:",
        result
      );

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Resume analysis failed."
        );
      }

      if (!result.analysis) {
        throw new Error(
          "AI returned no analysis."
        );
      }

      // IMPORTANT:
      // This sends the AI result into React state.
      setAnalysis(result.analysis);

    } catch (error) {
      console.error(
        "Resume analysis error:",
        error
      );

      setError(
        error.message ||
          "Resume analysis failed. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ==========================================
  // DOWNLOAD RESUME AS PDF
  // ==========================================

  const downloadPDF = async () => {
    const resumeElement =
      document.getElementById(
        "resume-preview"
      );

    if (!resumeElement) {
      setError(
        "Resume preview could not be found."
      );

      return;
    }

    try {
      setError("");

      const canvas = await html2canvas(
        resumeElement,
        {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
        }
      );

      const imgData =
        canvas.toDataURL(
          "image/jpeg",
          1.0
        );

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = 210;
      const pageHeight = 297;

      const imageWidth = pageWidth;

      const imageHeight =
        (canvas.height * imageWidth) /
        canvas.width;

      let heightLeft = imageHeight;
      let position = 0;

      pdf.addImage(
        imgData,
        "JPEG",
        0,
        position,
        imageWidth,
        imageHeight
      );

      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position =
          heightLeft - imageHeight;

        pdf.addPage();

        pdf.addImage(
          imgData,
          "JPEG",
          0,
          position,
          imageWidth,
          imageHeight
        );

        heightLeft -= pageHeight;
      }

      const fileName =
        resume.fullName.trim()
          ? `${resume.fullName.trim()}-Resume.pdf`
          : "My-Resume.pdf";

      pdf.save(fileName);

    } catch (error) {
      console.error(
        "PDF generation failed:",
        error
      );

      setError(
        "Could not generate the PDF."
      );
    }
  };

  // ==========================================
  // FORMAT FILE SIZE
  // ==========================================

  const formatFileSize = (bytes) => {
    if (!bytes) {
      return "0 KB";
    }

    const mb = bytes / (1024 * 1024);

    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    }

    return `${Math.round(bytes / 1024)} KB`;
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="resume-builder-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="resume-builder-header">

        <div className="resume-heading">

          <div className="resume-heading-icon">
            <FileText size={26} />
          </div>

          <div>
            <span className="eyebrow">
              AI CAREER ASSISTANT
            </span>

            <h1>
              AI Resume Builder
            </h1>

            <p>
              Upload your resume and get
              personalized AI feedback.
            </p>
          </div>

        </div>

        <button
          className="download-pdf-btn"
          onClick={downloadPDF}
        >
          <Download size={18} />
          Download PDF
        </button>

      </header>

      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div className="resume-error">
          <AlertCircle size={20} />

          <span>{error}</span>

          <button
            onClick={() => setError("")}
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* ======================================
          MAIN GRID
      ====================================== */}

      <div className="resume-main-grid">

        {/* ====================================
            LEFT SIDE
        ==================================== */}

        <main className="resume-editor">

          {/* ==================================
              UPLOAD CARD
          ================================== */}

          <section className="resume-card upload-card">

            <div className="section-heading">

              <div>
                <span className="section-label">
                  STEP 1
                </span>

                <h2>
                  Upload your resume
                </h2>

                <p>
                  Upload your existing CV and
                  let AI analyze it.
                </p>
              </div>

              <div className="section-icon">
                <Upload size={22} />
              </div>

            </div>

            {!selectedFile ? (

              <div
                className={`resume-dropzone ${
                  dragActive
                    ? "drag-active"
                    : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileInput}
                  hidden
                />

                <div className="upload-icon">
                  <Upload size={30} />
                </div>

                <h3>
                  Drag & drop your resume here
                </h3>

                <p>
                  or click to choose a file
                </p>

                <span>
                  PDF, DOC or DOCX • Max 10MB
                </span>

              </div>

            ) : (

              <div className="selected-file">

                <div className="selected-file-icon">
                  <FileText size={25} />
                </div>

                <div className="selected-file-info">

                  <strong>
                    {selectedFile.name}
                  </strong>

                  <span>
                    {formatFileSize(
                      selectedFile.size
                    )}
                  </span>

                </div>

                <CheckCircle
                  className="file-success"
                  size={22}
                />

                <button
                  className="remove-file-btn"
                  onClick={removeFile}
                  type="button"
                >
                  <X size={18} />
                </button>

              </div>

            )}

            {selectedFile && (
              <button
                className="analyze-btn"
                onClick={() =>
                  analyzeResume(
                    selectedFile
                  )
                }
                disabled={isAnalyzing}
              >

                {isAnalyzing ? (
                  <>
                    <Loader2
                      size={19}
                      className="spin"
                    />

                    AI is analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles size={19} />

                    Analyze Resume with AI
                  </>
                )}

              </button>
            )}

          </section>

          {/* ==================================
              AI ANALYSIS
          ================================== */}

          {(isAnalyzing || analysis) && (
            <section className="resume-card ai-analysis-card">

              <div className="section-heading">

                <div>

                  <span className="section-label ai-label">
                    AI POWERED
                  </span>

                  <h2>
                    Resume Analysis
                  </h2>

                  <p>
                    Personalized feedback from
                    your AI career assistant.
                  </p>

                </div>

                <div className="ai-icon">
                  <Sparkles size={23} />
                </div>

              </div>

              {isAnalyzing ? (

                <div className="ai-loading">

                  <div className="ai-loading-icon">
                    <Sparkles size={28} />
                  </div>

                  <h3>
                    AI is analyzing your resume...
                  </h3>

                  <p>
                    Checking your skills,
                    experience, grammar,
                    ATS compatibility and
                    career opportunities.
                  </p>

                </div>

              ) : (

                <div className="analysis-result">

                  <div className="analysis-intro">
                    <CheckCircle size={20} />

                    <span>
                      Analysis completed
                      successfully
                    </span>
                  </div>

                  <div className="analysis-text">
                    {analysis}
                  </div>

                </div>

              )}

            </section>
          )}

          {/* ==================================
              MANUAL RESUME EDITOR
          ================================== */}

          <section className="resume-card">

            <div className="section-heading">

              <div>
                <span className="section-label">
                  STEP 2
                </span>

                <h2>
                  Build your resume
                </h2>

                <p>
                  Edit your resume and see
                  changes in the preview.
                </p>
              </div>

              <div className="section-icon">
                <FileText size={22} />
              </div>

            </div>

            {/* Personal Information */}

            <div className="resume-form-section">

              <h3>
                Personal Information
              </h3>

              <div className="form-grid">

                <div className="form-group">
                  <label>
                    Full Name
                  </label>

                  <input
                    name="fullName"
                    value={resume.fullName}
                    onChange={handleChange}
                    placeholder="Muhammad Ali"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Professional Title
                  </label>

                  <input
                    name="jobTitle"
                    value={resume.jobTitle}
                    onChange={handleChange}
                    placeholder="Frontend Developer"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Email
                  </label>

                  <input
                    name="email"
                    value={resume.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Phone
                  </label>

                  <input
                    name="phone"
                    value={resume.phone}
                    onChange={handleChange}
                    placeholder="+92 XXX XXXXXXX"
                  />
                </div>

                <div className="form-group full-width">
                  <label>
                    Location
                  </label>

                  <input
                    name="location"
                    value={resume.location}
                    onChange={handleChange}
                    placeholder="Lahore, Pakistan"
                  />
                </div>

              </div>

            </div>

            {/* Summary */}

            <div className="resume-form-section">

              <h3>
                Professional Summary
              </h3>

              <textarea
                name="summary"
                value={resume.summary}
                onChange={handleChange}
                placeholder="Write a short professional summary..."
                rows={5}
              />

            </div>

            {/* Experience */}

            <div className="resume-form-section">

              <h3>
                Experience
              </h3>

              <textarea
                name="experience"
                value={resume.experience}
                onChange={handleChange}
                placeholder="Frontend Developer — Company Name
• Built React applications
• Integrated REST APIs"
                rows={7}
              />

            </div>

            {/* Education */}

            <div className="resume-form-section">

              <h3>
                Education
              </h3>

              <textarea
                name="education"
                value={resume.education}
                onChange={handleChange}
                placeholder="BS Computer Science — University Name — 2026"
                rows={5}
              />

            </div>

            {/* Skills */}

            <div className="resume-form-section">

              <h3>
                Skills
              </h3>

              <textarea
                name="skills"
                value={resume.skills}
                onChange={handleChange}
                placeholder="React, JavaScript, HTML, CSS, Node.js, Supabase"
                rows={4}
              />

            </div>

            {/* Projects */}

            <div className="resume-form-section">

              <h3>
                Projects
              </h3>

              <textarea
                name="projects"
                value={resume.projects}
                onChange={handleChange}
                placeholder="AI Career Assistant
Weather Application
Movie Search Application"
                rows={6}
              />

            </div>

          </section>

        </main>

        {/* ====================================
            RIGHT SIDE - LIVE PREVIEW
        ==================================== */}

        <aside className="resume-preview-area">

          <div className="preview-sticky">

            <div className="preview-top">

              <div>
                <span>
                  STEP 3
                </span>

                <h2>
                  Live Preview
                </h2>
              </div>

              <button
                onClick={downloadPDF}
                title="Download PDF"
              >
                <Download size={18} />
              </button>

            </div>

            <div
              className="resume-preview"
              id="resume-preview"
            >

              {/* Header */}

              <div className="preview-header">

                <h1>
                  {resume.fullName ||
                    "Your Name"}
                </h1>

                <h3>
                  {resume.jobTitle ||
                    "Professional Title"}
                </h3>

                <p>

                  {resume.email ||
                    "email@example.com"}

                  {resume.phone &&
                    ` • ${resume.phone}`}

                  {resume.location &&
                    ` • ${resume.location}`}

                </p>

              </div>

              {/* Summary */}

              <div className="preview-section">

                <h2>
                  Professional Summary
                </h2>

                <p>
                  {resume.summary ||
                    "Your professional summary will appear here."}
                </p>

              </div>

              {/* Experience */}

              <div className="preview-section">

                <h2>
                  Experience
                </h2>

                <p>
                  {resume.experience ||
                    "Your professional experience will appear here."}
                </p>

              </div>

              {/* Education */}

              <div className="preview-section">

                <h2>
                  Education
                </h2>

                <p>
                  {resume.education ||
                    "Your education will appear here."}
                </p>

              </div>

              {/* Skills */}

              <div className="preview-section">

                <h2>
                  Skills
                </h2>

                <p>
                  {resume.skills ||
                    "Your skills will appear here."}
                </p>

              </div>

              {/* Projects */}

              <div className="preview-section">

                <h2>
                  Projects
                </h2>

                <p>
                  {resume.projects ||
                    "Your projects will appear here."}
                </p>

              </div>

            </div>

          </div>

        </aside>

      </div>

    </div>
  );
}

export default ResumeBuilder;