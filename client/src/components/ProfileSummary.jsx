import { GraduationCap, Briefcase, Layers3, Target } from "lucide-react";
import "./ProfileSummary.css";

/**
 * ProfileSummary — reads from your existing `profiles` table.
 *
 * @param {object} props
 * @param {object} props.profile - { education, experience, skills, career_goal }
 *   `skills` may be a string or an array — both are handled.
 * @param {number} [props.completion] - 0–100, profile completion percent
 * @param {() => void} [props.onEditProfile]
 */
export default function ProfileSummary({ profile, completion = 0, onEditProfile }) {
  const skillsText = Array.isArray(profile?.skills)
    ? profile.skills.join(", ")
    : profile?.skills || "—";

  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (completion / 100) * circumference;

  return (
    <div className="panel profile-summary">
      <div className="panel-header">
        <h3>My Profile Summary</h3>
        <button className="link-btn" onClick={onEditProfile}>
          Edit Profile
        </button>
      </div>

      <div className="profile-summary-body">
        <dl className="profile-fields">
          <div className="profile-field">
            <dt>
              <GraduationCap size={15} /> Education
            </dt>
            <dd>{profile?.education || "Not added yet"}</dd>
          </div>
          <div className="profile-field">
            <dt>
              <Briefcase size={15} /> Experience
            </dt>
            <dd>{profile?.experience || "Not added yet"}</dd>
          </div>
          <div className="profile-field">
            <dt>
              <Layers3 size={15} /> Skills
            </dt>
            <dd>{skillsText}</dd>
          </div>
          <div className="profile-field">
            <dt>
              <Target size={15} /> Career Goal
            </dt>
            <dd>{profile?.career_goal || "Not set yet"}</dd>
          </div>
        </dl>

        <div className="completion-ring">
          <svg viewBox="0 0 100 100" width="104" height="104">
            <circle cx="50" cy="50" r="42" className="ring-track" />
            <circle
              cx="50"
              cy="50"
              r="42"
              className="ring-progress"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: offset,
              }}
            />
          </svg>
          <div className="completion-ring-label">
            <span className="mono-stat">{completion}%</span>
            <small>Completed</small>
          </div>
        </div>
      </div>
    </div>
  );
}
