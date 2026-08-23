import { Code2, Layers, Palette, Cpu } from "lucide-react";
import "./MatchedRoles.css";

// Placeholder only — replace with real results from the job-matching
// service, shaped like: { id, title, tags: string[], matchPercent }
const PLACEHOLDER_ROLES = [
  { id: 1, title: "Frontend Developer", tags: "React, JavaScript, HTML, CSS", match: 92, icon: Code2 },
  { id: 2, title: "Full Stack Developer", tags: "MERN Stack, Node.js, React", match: 85, icon: Layers },
  { id: 3, title: "UI/UX Developer", tags: "Figma, React, Tailwind CSS", match: 78, icon: Palette },
  { id: 4, title: "Software Engineer", tags: "DSA, System Design, JavaScript", match: 74, icon: Cpu },
];

export default function MatchedRoles({ roles = PLACEHOLDER_ROLES, onViewAll }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Top Matched Roles</h3>
        <button className="link-btn" onClick={onViewAll}>
          View All
        </button>
      </div>

      <ul className="role-list">
        {roles.map(({ id, title, tags, match, icon: Icon }) => (
          <li key={id} className="role-item">
            <span className="role-icon">
              <Icon size={17} strokeWidth={2} />
            </span>
            <span className="role-info">
              <span className="role-title">{title}</span>
              <span className="role-tags">{tags}</span>
            </span>
            <span className="role-match mono-stat">{match}% Match</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
