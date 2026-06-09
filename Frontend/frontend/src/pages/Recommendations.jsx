import { useState, useEffect } from "react";
import axios from "../api/axios";

export default function Recommendations() {
  const [form, setForm] = useState({
    role: "",
    skills: "",
    experience: "",
    interests: "",
    goal: "",
  });

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 AUTO-FILL SKILLS FROM BACKEND
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get("/users/resume/meta");

        if (res.data?.extractedSkills?.length) {
          setForm((prev) => ({
            ...prev,
            skills: res.data.extractedSkills.join(", "),
          }));
        }
      } catch {
        // ignore silently
      }
    };

    fetchSkills();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const getRecommendations = async () => {
  if (!form.skills || !form.role) {
    setError("Role and skills are required");
    return;
  }

  try {
    setLoading(true);
    setError("");
    setRecommendations([]);

    const res = await axios.post("/recommendations/ai", {
      role: form.role,
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),

      experience: form.experience,
      interests: form.interests,
      goal: form.goal,
    });

    console.log("AI Response:", res.data);

    setRecommendations(res.data.recommendations || []);
  } catch (err) {
    console.error("AI ERROR:", err.response?.data || err.message);

    setError(
      err.response?.data?.message ||
      "AI recommendation failed"
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
      <div className="container py-5">

        {/* HEADER */}
        <div className="text-center mb-5">
          <h2 className="fw-bold" style={{ color: "#1e293b" }}>
            🤖 AI Internship Recommendations
          </h2>
          <p style={{ color: "#64748b" }}>
            Smart suggestions based on your resume & skills
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        {/* FORM */}
        <div
          className="card border-0 shadow-lg p-4 mb-5"
          style={{ borderRadius: "16px" }}
        >
          <div className="row g-3">

            <div className="col-12 col-md-6">
              <label className="form-label">Target Role</label>
              <input
                className="form-control"
                style={inputStyle}
                name="role"
                placeholder="Frontend Developer"
                value={form.role}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">
                Skills ⚡ (Auto-filled from resume)
              </label>
              <input
                className="form-control"
                style={inputStyle}
                name="skills"
                placeholder="React, AWS, Node"
                value={form.skills}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Experience</label>
              <select
                className="form-select"
                style={inputStyle}
                name="experience"
                value={form.experience}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Interests</label>
              <input
                className="form-control"
                style={inputStyle}
                name="interests"
                placeholder="Web, AI, Cloud"
                value={form.interests}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Career Goal</label>
              <input
                className="form-control"
                style={inputStyle}
                name="goal"
                placeholder="Startup, Full-time role"
                value={form.goal}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* BUTTON */}
          <button
            className="btn w-100 mt-4"
            onClick={getRecommendations}
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #6366f1, #06b6d4)",
              color: "white",
              fontWeight: "600",
              padding: "12px",
              border: "none",
            }}
          >
            {loading ? "Analyzing with AI..." : "✨ Get AI Recommendations"}
          </button>
        </div>

        {/* RESULTS */}
        <div className="row">
          {!loading && recommendations.length === 0 && (
            <p className="text-center" style={{ color: "#64748b" }}>
              Your personalized recommendations will appear here ✨
            </p>
          )}

   {recommendations.map((job, i) => (
  <div className="col-12 col-md-6 col-lg-4 mb-4" key={i}>
    <div
      className="card h-100 border-0 shadow-sm p-3"
      style={{ borderRadius: "12px" }}
    >
      <h5 className="fw-bold mb-2">
        {job.job_title || "Internship"}
      </h5>

      <p className="mb-2 text-primary fw-semibold">
        {job.employer_name || "Unknown Company"}
      </p>

      <p className="text-muted small">
        📍 {job.job_city || "Remote"}{" "}
        {job.job_country || ""}
      </p>

      <div className="mt-3">
        <a
          href={job.job_apply_link}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary w-100"
        >
          Apply Now
        </a>
      </div>
    </div>
  </div>
))}
        </div>

      </div>
    </div>
  );
}

const inputStyle = {
  backgroundColor: "#fff",
  color: "#1e293b",
  border: "1px solid #cbd5f5",
  padding: "10px",
  fontWeight: "500",
};