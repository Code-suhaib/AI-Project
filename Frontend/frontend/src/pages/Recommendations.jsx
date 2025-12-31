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

      // 🔮 Later connect this to Amazon Bedrock / ML API
      const res = await axios.post("/recommendations/ai", {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()),
      });

      setRecommendations(res.data.recommendations || []);
    } catch (err) {
      console.error(err);
      setError("AI recommendation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold">
          <i className="bi bi-stars me-2 text-warning"></i>
          AI Internship Recommendations
        </h2>
        <p className="text-muted">
          Personalized suggestions powered by Amazon Bedrock
        </p>
      </div>

      {error && (
        <div className="alert alert-danger text-center">{error}</div>
      )}

      {/* Input Card */}
      <div className="card shadow-lg border-0 p-4 mb-5">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Target Role</label>
            <input
              className="form-control"
              name="role"
              placeholder="Frontend Developer"
              value={form.role}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Skills</label>
            <input
              className="form-control"
              name="skills"
              placeholder="React, AWS, Node"
              value={form.skills}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Experience Level</label>
            <select
              className="form-select"
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

          <div className="col-md-4">
            <label className="form-label">Area of Interest</label>
            <input
              className="form-control"
              name="interests"
              placeholder="Web, AI, Cloud"
              value={form.interests}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Career Goal</label>
            <input
              className="form-control"
              name="goal"
              placeholder="Full-time role, Startup"
              value={form.goal}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          className="btn btn-dark btn-lg mt-4 w-100"
          onClick={getRecommendations}
          disabled={loading}
        >
          {loading ? "Analyzing Profile..." : "Get AI Recommendations"}
        </button>
      </div>

      {/* Results */}
      <div className="row">
        {recommendations.length === 0 && !loading && (
          <p className="text-muted text-center">
            Your personalized recommendations will appear here ✨
          </p>
        )}

        {recommendations.map((rec, i) => (
          <div className="col-md-4 mb-3" key={i}>
            <div className="card h-100 shadow-sm border-0 p-3">
              <h6 className="fw-semibold">{rec.title}</h6>
              <p className="text-muted mb-1">{rec.reason}</p>
              <span className="badge bg-warning text-dark">
                Match Score: {rec.score}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
