import { Map, Check } from "lucide-react";
import "./LearningRoadmap.css";

/**
 * LearningRoadmap
 * @param {number} [progress] - 0–100
 * @param {string[]} [nextSteps] - short labels for the next couple of steps
 * @param {() => void} [onContinue]
 */
export default function LearningRoadmap({

  progress = 60,
  nextSteps = ["TypeScript fundamentals", "System design basics"],
  onContinue,
}) {
  return (
    <div className="roadmap-card">
      <div className="roadmap-card-header">
        <span className="roadmap-icon">
          <Map size={17} strokeWidth={2} />
        </span>
        <div>
          <h3>Your Learning Roadmap</h3>
          <p>Continue learning to achieve your career goals faster.</p>
        </div>
      </div>

      <div className="roadmap-progress-row">
        <div className="roadmap-progress-track">
          <div className="roadmap-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="roadmap-progress-value mono-stat">{progress}%</span>
      </div>

      <ul className="roadmap-steps">
        {nextSteps.map((step) => (
          <li key={step}>
            <span className="roadmap-step-dot">
              <Check size={11} strokeWidth={3} />
            </span>
            {step}
          </li>
        ))}
      </ul>

      <button className="btn btn--continue" onClick={onContinue}>
        Continue Learning
      </button>
    </div>
  );
}
