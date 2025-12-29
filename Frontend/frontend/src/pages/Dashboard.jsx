import { useState } from "react";
import axios from "../api/axios";
import Button from "../components/Button";

export default function Dashboard() {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchInternships = async () => {
    if (!skills.trim()) {
      setError("Please enter at least one skill");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setJobs([]);

      const res = await axios.post("/internships/search", {
        role: role || "intern",
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        location: "remote",
      });

      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to fetch internships. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">
        <i className="bi bi-search me-2"></i>
        Find Internships
      </h3>

      {error && (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      <div className="card shadow-sm p-4 mb-4">
        <input
          className="form-control mb-3"
          placeholder="Role (e.g. Frontend Developer)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <input
          className="form-control mb-3"
          placeholder="Skills (React, Node, AWS)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <Button onClick={fetchInternships} disabled={loading}>
          {loading ? (
            "Searching..."
          ) : (
            <>
              <i className="bi bi-lightning-charge me-2"></i>
              Search Internships
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      <div className="row">
        {jobs.length === 0 && !loading && !error && (
          <p className="text-muted text-center">
            No internships found yet. Try searching 👆
          </p>
        )}

        {jobs.map((job, i) => (
          <div className="col-md-4 mb-3" key={i}>
            <div className="card h-100 shadow-sm p-3">
              <h6 className="fw-semibold">{job.title}</h6>
              <p className="mb-1 text-muted">
                <i className="bi bi-building me-1"></i>
                {job.company}
              </p>
              <small className="text-muted">
                <i className="bi bi-geo-alt me-1"></i>
                {job.location}
              </small>

              {job.url && (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-outline-primary mt-2"
                >
                  Apply
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
