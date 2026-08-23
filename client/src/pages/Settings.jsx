import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./Settings.css";

function Settings() {
  const [fullName, setFullName] = useState("");
  const [careerGoal, setCareerGoal] = useState("");
  const [experienceLevel, setExperienceLevel] =
    useState("Entry Level");

  const [notifications, setNotifications] =
    useState(true);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load logged-in user FIRST
  const loadUser = async () => {
    console.log("Starting Settings...");

    try {
      setLoading(true);
      setError("");

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      console.log("Session:", session);

      if (sessionError) {
        throw sessionError;
      }

      if (!session || !session.user) {
        setError(
          "No active login session. Please login again."
        );
        return;
      }

      const currentUser = session.user;

      console.log(
        "Logged in user:",
        currentUser.email
      );

      setUser(currentUser);

      setFullName(
        currentUser.user_metadata?.full_name || ""
      );

    } catch (err) {
      console.error(
        "Settings error:",
        err
      );

      setError(
        err.message ||
          "Unable to load account."
      );

    } finally {
      console.log(
        "Finished loading Settings."
      );

      setLoading(false);
    }
  };

  // Call loadUser AFTER it has been declared
  useEffect(() => {
    loadUser();
  }, []);


  const handleSave = async () => {
    if (!user) {
      setError("You must be logged in.");
      return;
    }

    try {
      setError("");

      const { error: saveError } =
        await supabase
          .from("profiles")
          .update({
            full_name: fullName,
            career_goal: careerGoal,
          })
          .eq("user_id", user.id);

      if (saveError) {
        throw saveError;
      }

      alert("Settings saved successfully!");

    } catch (err) {
      console.error(
        "Save settings error:",
        err
      );

      setError(
        err.message ||
          "Failed to save settings."
      );
    }
  };


  if (loading) {
    return (
      <div className="settings-page">
        <div className="settings-card">
          Loading account...
        </div>
      </div>
    );
  }


  return (
    <div className="settings-page">

      {/* Error */}

      {error && (
        <div className="settings-error">
          {error}
        </div>
      )}

      {/* Header */}

      <div className="settings-header">

        <div>
          <span className="settings-label">
            ACCOUNT SETTINGS
          </span>

          <h1>Settings</h1>

          <p>
            Manage your account and career
            preferences.
          </p>
        </div>

      </div>


      {/* Account */}

      <section className="settings-card">

        <div className="settings-card-header">

          <h2>Account</h2>

          <p>
            Update your basic account information.
          </p>

        </div>


        <div className="settings-field">

          <label>Email</label>

          <input
            type="email"
            value={user?.email || ""}
            disabled
          />

        </div>


        <div className="settings-field">

          <label>Full Name</label>

          <input
            type="text"
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
            placeholder="Enter your full name"
          />

        </div>

      </section>


      {/* Career Preferences */}

      <section className="settings-card">

        <div className="settings-card-header">

          <h2>Career Preferences</h2>

          <p>
            Tell us about your career goals.
          </p>

        </div>


        <div className="settings-field">

          <label>Career Goal</label>

          <input
            type="text"
            value={careerGoal}
            onChange={(e) =>
              setCareerGoal(e.target.value)
            }
            placeholder="e.g. Full Stack Developer"
          />

        </div>


        <div className="settings-field">

          <label>
            Experience Level
          </label>

          <select
            value={experienceLevel}
            onChange={(e) =>
              setExperienceLevel(e.target.value)
            }
          >
            <option>Entry Level</option>
            <option>Junior</option>
            <option>Mid Level</option>
            <option>Senior</option>
          </select>

        </div>

      </section>


      {/* Notifications */}

      <section className="settings-card">

        <div className="settings-card-header">

          <h2>Notifications</h2>

          <p>
            Manage your notification preferences.
          </p>

        </div>


        <div className="settings-option">

          <div>

            <strong>
              Career updates
            </strong>

            <p>
              Receive updates and career
              recommendations.
            </p>

          </div>


          <label className="toggle">

            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) =>
                setNotifications(
                  e.target.checked
                )
              }
            />

            <span></span>

          </label>

        </div>

      </section>


      {/* Save */}

      <div className="settings-actions">

        <button
          className="save-settings"
          onClick={handleSave}
        >
          Save Changes
        </button>

      </div>

    </div>
  );
}

export default Settings;