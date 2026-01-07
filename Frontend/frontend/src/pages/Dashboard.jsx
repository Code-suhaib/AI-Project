import { useState } from "react";
import axios from "../api/axios";
import Button from "../components/Button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isFormValid = skills.trim().length > 0;

  const fetchInternships = async () => {
    if (!isFormValid) {
      setError("Please enter at least one skill");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setJobs([]);

      const res = await axios.post("/internships/search", {
        role: role.trim() || "intern",
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        location: "remote",
      });

      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch internships. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="container py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* HEADER */}
      <div className="mb-4">
        <h3 className="fw-semibold text-light">
          <i className="bi bi-search me-2"></i>
          Find Internships
        </h3>
        <p className="text-light opacity-75">
          Search internships manually or let AI recommend the best ones for you.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* SEARCH CARD */}
      <div className="card glass p-4 mb-5">
        <div className="row g-3">
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Role (e.g. Frontend Developer)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Skills (React, Node, AWS)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-4 d-flex gap-3 flex-wrap">
          <Button onClick={fetchInternships} disabled={loading || !isFormValid}>
            {loading ? (
              "Searching internships..."
            ) : (
              <>
                <i className="bi bi-lightning-charge me-2"></i>
                Search Internships
              </>
            )}
          </Button>

          <Link to="/activity" className="btn btn-outline-light">
            <i className="bi bi-clock-history me-2"></i>
            My Activity
          </Link>
        </div>
      </div>

      {/* AI RECOMMENDATION SECTION */}
      <div className="card glass p-4 mb-5">
        <h5 className="fw-semibold text-light mb-2">
          <i className="bi bi-stars me-2"></i>
          AI Recommendations
        </h5>

        <p className="text-light opacity-75 mb-3">
          Get personalized internship recommendations powered by{" "}
          <strong>Amazon Bedrock</strong>, based on your profile, skills, and
          interests.
        </p>

        <Link to="/recommendations" className="btn btn-outline-light">
          <i className="bi bi-cpu me-2"></i>
          Get AI Recommendations
        </Link>
      </div>

      {/* RESULTS */}
      <div className="row">
        {loading && (
          <p className="text-center text-light opacity-75">
            Fetching internships for you…
          </p>
        )}

        {!loading && jobs.length === 0 && !error && (
          <p className="text-center text-light opacity-75">
            No internships found yet. Try searching above 👆
          </p>
        )}

        {jobs.map((job, i) => (
          <div className="col-md-4 mb-4" key={i}>
            <motion.div
              className="card h-100 shadow-sm p-3"
              whileHover={{ y: -4 }}
            >
              <h6 className="fw-semibold">{job.title}</h6>

              <p className="mb-1 text-secondary">
                <i className="bi bi-building me-1"></i>
                {job.company}
              </p>

              <small className="text-secondary d-block">
                <i className="bi bi-geo-alt me-1"></i>
                {job.location}
              </small>

              {job.url && (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-outline-primary mt-3"
                >
                  Apply
                </a>
              )}
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
