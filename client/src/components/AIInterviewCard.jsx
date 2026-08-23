import { useNavigate } from "react-router-dom";
import { MessageSquare, ArrowRight } from "lucide-react";
import "./AIInterviewCard.css";

export default function AIInterviewCard() {
  const navigate = useNavigate();

  return (
    <div className="ai-interview-card">
      <div className="ai-interview-top">
        <div className="ai-interview-icon">
          <MessageSquare size={24} />
        </div>

        <span className="ai-interview-badge">
          AI POWERED
        </span>
      </div>

      <div className="ai-interview-body">
        <h2>AI Interview Prep</h2>

        <p>
          Practice realistic interview questions, get
          instant AI feedback, receive a score, and
          improve your answers.
        </p>

        <button
          className="ai-interview-button"
          onClick={() => navigate("/Interview-Pre")}
        >
          Start Interview
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}