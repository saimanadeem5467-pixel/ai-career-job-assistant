import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  User,
  Mail,
  GraduationCap,
  Briefcase,
  Target,
  Code2,
  FileText,
  Save,
  Edit3,
  CheckCircle,
} from "lucide-react";

import "./MyProfile.css";

const fields = [
  "full_name",
  "education",
  "skills",
  "experience",
  "career_goal",
  "bio",
];

function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    full_name: "",
    education: "",
    skills: "",
    experience: "",
    career_goal: "",
    bio: "",
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(()=>{
    loadMyProfile();
  },[]);
async function loadMyProfile(){
  setLoading(true);
     const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      setMessage(userError.message);
      setLoading(false);
      return;
    }

    if (!user) {
      setMessage("Please login first.");
      setLoading(false);
      return;
    }

    setUser(user);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error(error);
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (data) {
      setProfile({
        full_name: data.full_name || "",
        education: data.education || "",
        skills: data.skills || "",
        experience: data.experience || "",
        career_goal: data.career_goal || "",
        bio: data.bio || "",
      });
    }

    setLoading(false);
  }
   useEffect(()=>{
    loadMyProfile();
  },[]);

  function handleChange(e) {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function saveProfile() {
    if (!user) return;

    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          user_id: user.id,
          email: user.email,
          full_name: profile.full_name,
          education: profile.education,
          skills: profile.skills,
          experience: profile.experience,
          career_goal: profile.career_goal,
          bio: profile.bio,
        },
        {
          onConflict: "user_id",
        }
      );

    if (error) {
      console.error(error);
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setMessage("Profile updated successfully!");
    setEditing(false);
    setSaving(false);
  }

  const completion = Math.round(
    (fields.filter(
      (field) => String(profile[field] || "").trim().length > 0
    ).length /
      fields.length) *
      100
  );

  const skillList = profile.skills
    ? profile.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">

      {/* Header */}
      <div className="profile-topbar">
        <div>
          <p className="profile-eyebrow">CAREER ASSISTANT</p>
          <h1>My Profile</h1>
          <p>Build your professional identity and improve your career recommendations.</p>
        </div>

        <button
          className="edit-profile-btn"
          onClick={() => setEditing(!editing)}
        >
          <Edit3 size={18} />
          {editing ? "Cancel Editing" : "Edit Profile"}
        </button>
      </div>

      {/* Profile Hero */}
      <section className="profile-hero">

        <div className="profile-avatar">
          {profile.full_name
            ? profile.full_name.charAt(0).toUpperCase()
            : "U"}
        </div>

        <div className="profile-hero-info">
          <h2>{profile.full_name || "Your Name"}</h2>

          <p>
            <Mail size={16} />
            {user?.email}
          </p>

          <span className="profile-status">
            <CheckCircle size={15} />
            Profile Active
          </span>
        </div>

        <div className="completion-box">
          <div className="completion-number">
            {completion}%
          </div>

          <div>
            <strong>Profile Completion</strong>
            <p>
              {completion === 100
                ? "Your profile is complete!"
                : "Complete your profile to get better AI recommendations."}
            </p>
          </div>
        </div>

      </section>

      {/* Main Grid */}
      <div className="profile-grid">

        {/* Personal Information */}
        <section className="profile-card">

          <div className="card-heading">
            <div className="heading-icon purple">
              <User size={20} />
            </div>

            <div>
              <h3>Personal Information</h3>
              <p>Your basic professional information</p>
            </div>
          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>Full Name</label>

              <div className="input-wrapper">
                <User size={18} />

                <input
                  name="full_name"
                  value={profile.full_name}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>

              <div className="input-wrapper disabled-input">
                <Mail size={18} />

                <input
                  value={user?.email || ""}
                  disabled
                />
              </div>
            </div>

          </div>
        </section>

        {/* Career Information */}
        <section className="profile-card">

          <div className="card-heading">
            <div className="heading-icon blue">
              <Briefcase size={20} />
            </div>

            <div>
              <h3>Career Information</h3>
              <p>Help AI understand your career direction</p>
            </div>
          </div>

          <div className="form-group">
            <label>Education</label>

            <div className="input-wrapper">
              <GraduationCap size={18} />

              <input
                name="education"
                value={profile.education}
                onChange={handleChange}
                disabled={!editing}
                placeholder="e.g. BS Computer Science"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Experience</label>

            <div className="input-wrapper">
              <Briefcase size={18} />

              <input
                name="experience"
                value={profile.experience}
                onChange={handleChange}
                disabled={!editing}
                placeholder="e.g. 1 year frontend experience"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Career Goal</label>

            <div className="input-wrapper">
              <Target size={18} />

              <input
                name="career_goal"
                value={profile.career_goal}
                onChange={handleChange}
                disabled={!editing}
                placeholder="e.g. Become a Full Stack Developer"
              />
            </div>
          </div>

        </section>

        {/* Skills */}
        <section className="profile-card full-width">

          <div className="card-heading">
            <div className="heading-icon green">
              <Code2 size={20} />
            </div>

            <div>
              <h3>Skills</h3>
              <p>Separate your skills using commas</p>
            </div>
          </div>

          <div className="form-group">
            <label>Your Skills</label>

            <div className="input-wrapper">
              <Code2 size={18} />

              <input
                name="skills"
                value={profile.skills}
                onChange={handleChange}
                disabled={!editing}
                placeholder="React, JavaScript, HTML, CSS, Node.js"
              />
            </div>
          </div>

          {skillList.length > 0 && (
            <div className="skills-list">
              {skillList.map((skill, index) => (
                <span className="skill-tag" key={index}>
                  {skill}
                </span>
              ))}
            </div>
          )}

        </section>

        {/* Bio */}
        <section className="profile-card full-width">

          <div className="card-heading">
            <div className="heading-icon orange">
              <FileText size={20} />
            </div>

            <div>
              <h3>About Me</h3>
              <p>Tell the AI assistant more about yourself</p>
            </div>
          </div>

          <div className="form-group">

            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Tell us about your experience, interests, strengths and career ambitions..."
              rows="6"
            />

          </div>

        </section>

      </div>

      {/* Save */}
      {editing && (
        <div className="save-section">

          <button
            className="save-profile-btn"
            onClick={saveProfile}
            disabled={saving}
          >
            <Save size={18} />

            {saving ? "Saving..." : "Save Profile"}
          </button>

        </div>
      )}

      {message && (
        <div
          className={
            message.includes("successfully")
              ? "profile-message success"
              : "profile-message error"
          }
        >
          {message}
        </div>
      )}

    </div>
  );
}

export default Profile;