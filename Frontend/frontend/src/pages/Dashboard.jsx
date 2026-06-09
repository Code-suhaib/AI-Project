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

    console.log("✅ Internship Response:", res.data);

    alert(`Found ${res.data?.jobs?.length || 0} internships`);

    setJobs(Array.isArray(res.data?.jobs) ? res.data.jobs : []);
  } catch (err) {
    console.error("❌ Internship Error:", err);

    setError(
      err.response?.data?.message ||
      err.message ||
      "Failed to fetch internships"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eef2ff, #e0f7fa, #f8fafc)",
      }}
    >
      <div className="container py-4">

        {/* HEADER */}
        <div className="text-center mb-5">
          <h2 className="fw-bold" style={{ color: "#1e293b" }}>
            Find Your Perfect Internship 🚀
          </h2>
          <p style={{ color: "#64748b" }}>
            Enter your skills and let AI + real-time data find the best opportunities
          </p>
        </div>

        {/* SEARCH CARD */}
        <div
          className="card border-0 shadow-lg p-4 mb-5"
          style={{
            borderRadius: "16px",
            background: "#ffffff",
          }}
        >
          <div className="row g-3">

            {/* ROLE */}
            <div className="col-12 col-md-6">
              <input
                className="form-control"
                style={{
                  backgroundColor: "#fff",
                  color: "#1e293b",
                  border: "1px solid #cbd5f5",
                  padding: "12px",
                  fontWeight: "500"
                }}
                placeholder="Role (Frontend Developer)"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            {/* SKILLS */}
            <div className="col-12 col-md-6">
              <input
                className="form-control"
                style={{
                  backgroundColor: "#fff",
                  color: "#1e293b",
                  border: "1px solid #cbd5f5",
                  padding: "12px",
                  fontWeight: "500"
                }}
                placeholder="Skills (React, Node, AWS)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>

          </div>

          {/* BUTTONS */}
          <div className="mt-4 d-flex gap-3 flex-wrap">
            <Button
              onClick={fetchInternships}
              disabled={loading || !isFormValid}
              style={{
                background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                border: "none",
                color: "white",
                fontWeight: "600",
                padding: "10px 18px",
              }}
            >
              {loading ? "Searching..." : "Search Internships"}
            </Button>

            <Link
              to="/recommendations"
              className="btn"
              style={{
                border: "1px solid #6366f1",
                color: "#6366f1",
                fontWeight: "500",
              }}
            >
              🤖 AI Recommend
            </Link>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="alert alert-danger text-center">
            {error}
          </div>
        )}

        {/* RESULTS */}
        <div className="row">

          {loading && (
            <p className="text-center" style={{ color: "#64748b" }}>
              Finding internships for you...
            </p>
          )}

          {!loading && jobs.length === 0 && !error && (
            <p className="text-center" style={{ color: "#64748b" }}>
              No results yet. Start searching 👆
            </p>
          )}

          {jobs.map((job, i) => (
            <div className="col-12 col-md-6 col-lg-4 mb-4" key={i}>
              <motion.div
                className="card h-100 border-0 shadow-sm p-3"
                style={{ borderRadius: "12px" }}
                whileHover={{ y: -5 }}
              >
                <h6 className="fw-bold" style={{ color: "#1e293b" }}>
                  {job.title}
                </h6>

                <p className="mb-1" style={{ color: "#64748b" }}>
                  <i className="bi bi-building me-1"></i>
                  {job.company}
                </p>

                <small style={{ color: "#94a3b8" }}>
                  <i className="bi bi-geo-alt me-1"></i>
                  {job.location}
                </small>

                <div className="mt-auto">
                  {job.url && (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn mt-3 w-100"
                      style={{
                        background: "#6366f1",
                        color: "white",
                        fontWeight: "500",
                      }}
                    >
                      Apply Now
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}