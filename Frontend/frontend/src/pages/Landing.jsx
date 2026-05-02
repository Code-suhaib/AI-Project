import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #eef2ff, #e0f7fa, #f5f3ff)",
      }}
    >
      <div className="container text-center">

        {/* ICON */}
        <div className="mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle shadow"
            style={{
              width: "100px",
              height: "100px",
              background: "linear-gradient(135deg, #6366f1, #06b6d4)",
              color: "white",
            }}
          >
            <i className="bi bi-robot display-5"></i>
          </div>
        </div>

        {/* TITLE */}
        <h1 className="fw-bold mb-3" style={{ color: "#1e293b" }}>
          AI Internship Finder 🚀
        </h1>

        {/* SUBTEXT */}
        <p className="lead mb-4" style={{ color: "#475569" }}>
          Discover internships tailored to your skills, interests, and career goals
          using intelligent AI recommendations.
        </p>

        {/* BUTTONS */}
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Link to="/login" className="btn btn-primary btn-lg px-4 shadow">
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Login
          </Link>

          <Link to="/register" className="btn btn-outline-primary btn-lg px-4">
            <i className="bi bi-person-plus-fill me-2"></i>
            Get Started
          </Link>
        </div>

        {/* FEATURES */}
        <div className="row mt-5">

          <div className="col-md-4 mb-3">
            <div className="p-3 bg-white rounded-4 shadow-sm h-100">
              <i className="bi bi-cpu-fill fs-2 text-primary"></i>
              <h5 className="mt-2">AI Smart Matching</h5>
              <p className="text-muted small">
                Advanced AI matches internships based on your skills
              </p>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="p-3 bg-white rounded-4 shadow-sm h-100">
              <i className="bi bi-globe fs-2 text-info"></i>
              <h5 className="mt-2">Global Opportunities</h5>
              <p className="text-muted small">
                Discover internships from across the world
              </p>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="p-3 bg-white rounded-4 shadow-sm h-100">
              <i className="bi bi-bar-chart-fill fs-2 text-success"></i>
              <h5 className="mt-2">Personalized Insights</h5>
              <p className="text-muted small">
                Get ranked recommendations tailored to you
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}