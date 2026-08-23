import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, Briefcase, TrendingUp, Target } from "lucide-react";
import { supabase } from "../supabaseClient";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import AICareerCard from "../components/AICareerCard";
import MatchedRoles from "../components/MatchedRoles";
import ProfileSummary from "../components/ProfileSummary";
import LearningRoadmap from "../components/LearningRoadmap";
import AIInterviewCard from "../components/AIInterviewCard";


import "../styles/panels.css";
import "./Dashboard.css";

// Fields used to compute a real (not fake) profile-completion percentage.
// Add/remove keys here if your `profiles` table grows.
const COMPLETION_FIELDS = [
  "full_name",
  "education",
  "skills",
  "experience",
  "career_goal",
  "bio",
];

/**
 * Dashboard
 *
 * Auth + profile loading is restored from your original Dashboard.jsx:
 *  - supabase.auth.getUser() on mount
 *  - redirect to /login when there's no user
 *  - load the matching row from `profiles` (by user_id)
 *  - supabase.auth.signOut() on logout, then redirect to /login
 *
 * AI-driven stats (Job Matches, Skills Score) are NOT implemented yet —
 * they're clearly marked placeholders below, per your instructions not
 * to connect the AI API yet. Profile Completion is real, computed from
 * the loaded profile.
 */
export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadUserAndProfile() {
      setLoading(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Get user error:", error.message);
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      if (!user) {
        navigate("/login");
        return;
      }

      setUser(user);

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Profile error:", profileError.message);
        setErrorMessage(profileError.message);
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
      } else {
        // Row doesn't exist yet (new user who hasn't saved a profile).
        setProfile({
          full_name: "",
          education: "",
          skills: "",
          experience: "",
          career_goal: "",
          bio: "",
        });
      }

      setLoading(false);
    }

    loadUserAndProfile();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
      setErrorMessage(error.message);
      return;
    }
    navigate("/login");
  };

  // Real, computed from actual profile data — not hard-coded.
  const profileCompletion = profile
    ? Math.round(
        (COMPLETION_FIELDS.filter((key) => String(profile[key] || "").trim().length > 0)
          .length /
          COMPLETION_FIELDS.length) *
          100
      )
    : 0;

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "there";

  // TODO: Job Matches + Skills Score need the AI/job-matching backend —
  // left as clearly-marked placeholders until that's connected.
  const stats = {
    jobMatches: 24,
    skillsScore: 72,
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <div className="dashboard-main">
          <div className="dashboard-loading">Loading your dashboard…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="dashboard-main">
        <Navbar onMenuClick={() => setSidebarOpen(true)} profile={profile} />

        <div className="dashboard-content">
          <div className="dashboard-greeting">
            <h1>Welcome back, {displayName}! 👋</h1>
            <p>Let's build your future together.</p>
            {errorMessage && <p className="dashboard-error">{errorMessage}</p>}
          </div>

          <div className="stats-grid">
            <StatCard
              icon={UserCircle}
              label="Profile Completion"
              value={`${profileCompletion}%`}
              progress={profileCompletion}
              footer={profileCompletion < 100 ? "Almost there!" : "All set!"}
              accent="violet"
            />
            <StatCard
              icon={Briefcase}
              label="Job Matches"
              value={stats.jobMatches}
              footer="View matches"
              footerHref="/job-matches"
              accent="blue"
            />
            <StatCard
              icon={TrendingUp}
              label="Skills Score"
              value={`${stats.skillsScore}%`}
              footer="Good progress!"
              accent="teal"
            />
            <StatCard
              icon={Target}
              label="Career Goal"
              value={profile?.career_goal || "Not set yet"}
              footer="View roadmap"
              footerHref="/learning-roadmap"
              accent="orange"
            />
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-col dashboard-col--main">
              <AICareerCard
                onAnalyze={() => navigate("/AICareerAdvisor")}
                onViewFull={() => navigate("/AICareerAdvisor")}
              />
              <ProfileSummary
                profile={profile}
                completion={profileCompletion}
                onEditProfile={() => navigate("/profile")}
              />
              <LearningRoadmap
                progress={60}
                onContinue={() => navigate("/learning-roadmap")}
              />
            </div>

            <div className="dashboard-col dashboard-col--side">
              <MatchedRoles onViewAll={() => navigate("/job-matches")} />
            <AIInterviewCard/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}