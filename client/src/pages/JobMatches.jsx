import {  useState } from "react";
import {
  Briefcase,
  MapPin,
  ExternalLink,
  RefreshCw,
  Search,
} from "lucide-react";

import "./JobMatches.css";

function JobMatches() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/jobs/matches",
        {
          method: "GET",
          
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load jobs."
        );
      }

      setJobs(Array.isArray(result.jobs) ? result.jobs : []);
    } catch (err) {
      console.error("Job matches error:", err);
      setError(
        err.message ||
          "Unable to load job matches."
      );
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="job-matches-page">

      {/* HEADER */}

      <div className="job-matches-header">

        <div>
          <span className="job-eyebrow">
            AI CAREER ASSISTANT
          </span>

          <h1>Job Matches</h1>

          <p>
            Find opportunities that match your
            skills and career goals.
          </p>
        </div>

        <button
          className="refresh-jobs-btn"
          onClick={fetchJobs}
          disabled={loading}
        >
          <RefreshCw
            size={17}
            className={loading ? "spin" : ""}
          />

          Refresh
        </button>

      </div>


      {/* SEARCH / FILTER AREA */}

      <div className="job-toolbar">

        <div className="job-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search jobs..."
          />
        </div>

      </div>


      {/* LOADING */}

      {loading && (
        <div className="jobs-state">

          <div className="jobs-loader">
            <RefreshCw
              size={25}
              className="spin"
            />
          </div>

          <h3>Finding your job matches...</h3>

          <p>
            We're looking for opportunities
            based on your profile.
          </p>

        </div>
      )}


      {/* ERROR */}

      {!loading && error && (
        <div className="jobs-state error-state">

          <div className="state-icon">
            <Briefcase size={25} />
          </div>

          <h3>Couldn't load job matches</h3>

          <p>{error}</p>

          <button
            className="try-again-btn"
            onClick={fetchJobs}
          >
            Try Again
          </button>

        </div>
      )}


      {/* NO JOBS */}

      {!loading &&
        !error &&
        jobs.length === 0 && (
          <div className="jobs-state">

            <div className="state-icon">
              <Briefcase size={25} />
            </div>

            <h3>No job matches yet</h3>

            <p>
              Complete your profile and resume
              analysis to find relevant
              opportunities.
            </p>

          </div>
        )}


      {/* REAL JOBS */}

      {!loading &&
        !error &&
        jobs.length > 0 && (

          <div className="jobs-list">

            {jobs.map((job) => (

              <article
                className="job-card"
                key={
                  job.id ||
                  job.url ||
                  job.title
                }
              >

                <div className="job-card-top">

                  <div className="company-icon">
                    <Briefcase size={21} />
                  </div>

                  <div className="job-main-info">

                    <h2>
                      {job.title}
                    </h2>

                    <p className="company-name">
                      {job.company ||
                        "Company"}
                    </p>

                  </div>

                  {job.matchScore !==
                    undefined && (
                    <div className="match-score">
                      {job.matchScore}% Match
                    </div>
                  )}

                </div>


                <div className="job-details">

                  {job.location && (
                    <span>
                      <MapPin size={15} />
                      {job.location}
                    </span>
                  )}

                  {job.type && (
                    <span>
                      <Briefcase size={15} />
                      {job.type}
                    </span>
                  )}

                </div>


                {job.description && (
                  <p className="job-description">
                    {job.description}
                  </p>
                )}


                {Array.isArray(
                  job.skills
                ) &&
                  job.skills.length > 0 && (
                    <div className="job-skills">

                      {job.skills.map(
                        (skill) => (
                          <span
                            key={skill}
                          >
                            {skill}
                          </span>
                        )
                      )}

                    </div>
                  )}


                <div className="job-card-footer">

                  {job.postedAt && (
                    <span className="posted-date">
                      {job.postedAt}
                    </span>
                  )}

                  {job.url && (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-job-btn"
                    >
                      View Job
                      <ExternalLink
                        size={15}
                      />
                    </a>
                  )}

                </div>

              </article>

            ))}

          </div>
        )}

    </div>
  );
}

export default JobMatches;