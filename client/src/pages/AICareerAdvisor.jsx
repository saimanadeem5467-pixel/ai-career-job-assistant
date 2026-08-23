import { useState } from "react";
import { Sparkles, Send, Loader2, Lightbulb } from "lucide-react";
import "./AICareerAdvisor.css";

function AICareerAdvisor() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      // We will connect your existing AI backend here next.
      const response = await fetch("http://localhost:5000/api/ai/career-advice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          profile: {
            education:"",
            skills:"",
            experience:"",
            career_goals:"",
            bio:""
          },
        }),
      });
      console.log("Backend status:", response.status);

      const data = await response.json();
      console.log("Backend response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to get AI response");
      }

      setAnswer(data.answer);
    } catch (error) {
      console.error("AI Advisor error:", error);
      setAnswer(
        error.message || "An error occurred while getting advice. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-advisor-page">
      <div className="ai-advisor-header">
        <div className="ai-icon">
          <Sparkles size={28} />
        </div>

        <div>
          <p className="ai-eyebrow">AI CAREER ASSISTANT</p>
          <h1>AI Career Advisor</h1>
          <p>
            Get personalized career guidance based on your skills,
            experience and goals.
          </p>
        </div>
      </div>

      <div className="ai-advisor-card">
        <div className="card-title">
          <Lightbulb size={20} />
          <h2>Ask your career question</h2>
        </div>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Example: What skills should I learn to become a full-stack developer?"
          rows="6"
        />

        <button
          className="ask-ai-btn"
          onClick={askAI}
          disabled={loading || !question.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="spin" size={18} />
              Analyzing...
            </>
          ) : (
            <>
              <Send size={18} />
              Ask AI
            </>
          )}
        </button>
      </div>

      {answer && (
        <div className="ai-answer-card">
          <div className="answer-header">
            <Sparkles size={20} />
            <h2>AI Recommendation</h2>
          </div>

          <div className="answer-content">
            {answer}
          </div>
        </div>
      )}
    </div>
  );
}

export default AICareerAdvisor;