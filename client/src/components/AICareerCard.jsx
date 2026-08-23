import { Sparkles, Bot } from "lucide-react";
import "./AICareerCard.css";

/**
 * AICareerCard — headline AI recommendation panel.
 *
 * UI-only for now: `onAnalyze` is a stub. Wire it to your Node/Express
 * endpoint once the AI API is connected — do not call an AI API directly
 * from the frontend.
 *
 * @param {object} props
 * @param {string} [props.summary] - pass the AI-generated summary once available
 * @param {() => void} [props.onAnalyze]
 * @param {() => void} [props.onViewFull]
 */
export default function AICareerCard({
  summary = "Based on your skills, education, experience, and career goal, our AI will recommend suitable career paths.",
  onAnalyze,
  onViewFull,
}) {
  return (
    <div className="ai-card">
      <div className="ai-card-avatar">
        <span className="ai-card-avatar-ring" />
        <span className="ai-card-avatar-core">
          <Bot size={26} strokeWidth={1.8} />
        </span>
      </div>

      <div className="ai-card-body">
        <div className="ai-card-title">
          <Sparkles size={16} className="ai-card-title-icon" />
          <span>AI Career Recommendation</span>
        </div>

        <p className="ai-card-summary">{summary}</p>

        <div className="ai-card-actions">
          <button className="btn btn--primary" onClick={onAnalyze}>
            ✨ Analyze My Career
          </button>
          <button className="btn btn--ghost" onClick={onViewFull}>
            View Full Recommendation
          </button>
        </div>
      </div>
    </div>
  );
}
