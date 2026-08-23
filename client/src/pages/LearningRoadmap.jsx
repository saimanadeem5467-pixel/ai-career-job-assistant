import { useState } from "react";
import {
  Map,
  Sparkles,
  Target,
  Clock,
  CheckCircle,

  AlertCircle,
  RefreshCw,
} from "lucide-react";

import "./LearningRoadmap.css";

function LearningRoadmap() {
  const [targetRole, setTargetRole] = useState("");
  const [currentSkills, setCurrentSkills] = useState("");

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateRoadmap = async () => {
    if (!targetRole.trim()) {
      setError("Please enter your target career.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setRoadmap(null);

      console.log("Generating learning roadmap...");

      const response = await fetch(
        "http://localhost:5000/api/ai/learning-roadmap",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            targetRole,
            currentSkills,
          }),
        }
      );

      const result = await response.json();

      console.log("Learning roadmap result:", result);

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to generate learning roadmap."
        );
      }

      setRoadmap(result.roadmap);

    } catch (err) {
      console.error(
        "Learning Roadmap Error:",
        err
      );

      setError(
        err.message ||
          "Unable to generate roadmap."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="learning-roadmap-page">

      {/* HEADER */}

      <div className="roadmap-header">

        <div className="roadmap-heading">

          <div className="roadmap-header-icon">
            <Map size={27} />
          </div>

          <div>
            <span className="roadmap-eyebrow">
              AI CAREER ASSISTANT
            </span>

            <h1>Learning Roadmap</h1>

            <p>
              Get a personalized learning path
              based on your career goal and skills.
            </p>
          </div>

        </div>

      </div>


      {/* ERROR */}

      {error && (
        <div className="roadmap-error">
          <AlertCircle size={18} />
          <span>{error}</span>

          <button
            onClick={() => setError("")}
          >
            ×
          </button>
        </div>
      )}


      {/* CAREER GOAL */}

      <section className="roadmap-card">

        <div className="roadmap-card-heading">

          <div className="roadmap-icon">
            <Target size={21} />
          </div>

          <div>
            <h2>Your Career Goal</h2>

            <p>
              Tell AI what career you want to
              prepare for.
            </p>
          </div>

        </div>


        <div className="roadmap-form">

          <div className="roadmap-field">

            <label>
              Target Career
            </label>

            <input
              type="text"
              value={targetRole}
              onChange={(e) =>
                setTargetRole(e.target.value)
              }
              placeholder="e.g. Full-Stack Developer"
            />

          </div>


          <div className="roadmap-field">

            <label>
              Current Skills
            </label>

            <textarea
              value={currentSkills}
              onChange={(e) =>
                setCurrentSkills(e.target.value)
              }
              placeholder="e.g. HTML, CSS, JavaScript, React, Supabase"
              rows="4"
            />

          </div>


          <button
            className="generate-roadmap-btn"
            onClick={generateRoadmap}
            disabled={loading}
          >

            {loading ? (
              <>
                <RefreshCw
                  size={17}
                  className="spin"
                />

                Generating Roadmap...
              </>
            ) : (
              <>
                <Sparkles size={17} />

                Generate My Roadmap
              </>
            )}

          </button>

        </div>

      </section>


      {/* LOADING */}

      {loading && (
        <section className="roadmap-loading">

          <div className="loading-icon">
            <Sparkles size={25} />
          </div>

          <h3>
            AI is creating your roadmap...
          </h3>

          <p>
            We're analyzing your career goal
            and current skills.
          </p>

        </section>
      )}


      {/* ROADMAP RESULT */}

      {!loading && roadmap && (
        <section className="roadmap-card roadmap-result">

          <div className="roadmap-card-heading">

            <div className="roadmap-icon ai">
              <Sparkles size={21} />
            </div>

            <div>
              <span className="result-label">
                AI GENERATED
              </span>

              <h2>
                Your Learning Path
              </h2>

              <p>
                Follow these steps to move toward
                your target career.
              </p>
            </div>

          </div>


          <div className="roadmap-content">

            {/* Summary */}

            {roadmap.summary && (
              <div className="roadmap-summary">
                <h3>Overview</h3>

                <p>
                  {roadmap.summary}
                </p>
              </div>
            )}


            {/* Steps */}

            {Array.isArray(
              roadmap.steps
            ) &&
              roadmap.steps.length > 0 && (

                <div className="roadmap-steps">

                  {roadmap.steps.map(
                    (step, index) => (

                      <div
                        className="roadmap-step"
                        key={index}
                      >

                        <div className="step-line">

                          <div className="step-number">
                            {index + 1}
                          </div>

                          {index <
                            roadmap.steps.length -
                              1 && (
                            <div className="vertical-line" />
                          )}

                        </div>


                        <div className="step-content">

                          <div className="step-top">

                            <div>
                              <span className="step-label">
                                STEP{" "}
                                {index + 1}
                              </span>

                              <h3>
                                {step.title ||
                                  "Learning Step"}
                              </h3>
                            </div>

                            {step.priority && (
                              <span
                                className={`step-priority ${String(
                                  step.priority
                                ).toLowerCase()}`}
                              >
                                {
                                  step.priority
                                }
                              </span>
                            )}

                          </div>


                          {step.description && (
                            <p>
                              {
                                step.description
                              }
                            </p>
                          )}


                          {step.skills &&
                            Array.isArray(
                              step.skills
                            ) && (
                              <div className="step-skills">

                                {step.skills.map(
                                  (
                                    skill,
                                    skillIndex
                                  ) => (
                                    <span
                                      key={
                                        skillIndex
                                      }
                                    >
                                      {
                                        skill
                                      }
                                    </span>
                                  )
                                )}

                              </div>
                            )}


                          {step.duration && (
                            <div className="step-duration">
                              <Clock size={14} />

                              {
                                step.duration
                              }
                            </div>
                          )}

                        </div>

                      </div>

                    )
                  )}

                </div>
              )}


            {/* Next Step */}

            {roadmap.nextStep && (
              <div className="next-step">

                <div className="next-step-icon">
                  <CheckCircle
                    size={20}
                  />
                </div>

                <div>
                  <span>
                    YOUR NEXT STEP
                  </span>

                  <p>
                    {roadmap.nextStep}
                  </p>
                </div>

              </div>
            )}

          </div>

        </section>
      )}


      {/* EMPTY STATE */}

      {!loading && !roadmap && !error && (
        <section className="roadmap-empty">

          <div className="empty-icon">
            <Map size={26} />
          </div>

          <h3>
            Your roadmap will appear here
          </h3>

          <p>
            Enter your target career and current
            skills above, then let AI create a
            personalized learning path.
          </p>

        </section>
      )}

    </div>
  );
}

export default LearningRoadmap;