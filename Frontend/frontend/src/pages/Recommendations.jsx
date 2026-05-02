import { useState } from "react";
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
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()),
      });

      setRecommendations(res.data.recommendations || []);
    } catch (err) {
      setError("AI recommendation failed. Try again.");
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
            Smart suggestions powered by AI based on your profile
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        {/* FORM CARD */}
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
              <label className="form-label">Skills</label>
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

          {recommendations.length === 0 && !loading && (
            <p className="text-center" style={{ color: "#64748b" }}>
              Your personalized recommendations will appear here ✨
            </p>
          )}

          {recommendations.map((rec, i) => (
            <div className="col-12 col-md-6 col-lg-4 mb-4" key={i}>
              <div
                className="card h-100 border-0 shadow-sm p-3"
                style={{ borderRadius: "12px" }}
              >
                <h6 className="fw-bold" style={{ color: "#1e293b" }}>
                  {rec.title}
                </h6>

                <p style={{ color: "#64748b" }}>
                  {rec.reason}
                </p>

                <span
                  className="badge"
                  style={{
                    background: "#e0f2fe",
                    color: "#0369a1",
                    fontWeight: "500",
                  }}
                >
                  Match: {rec.score}%
                </span>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

/* INPUT STYLE */
const inputStyle = {
  backgroundColor: "#fff",
  color: "#1e293b",
  border: "1px solid #cbd5f5",
  padding: "10px",
  fontWeight: "500",
};