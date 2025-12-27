import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 text-white"
      style={{
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      }}
    >
      <div className="container text-center">
        <div className="mb-4">
          <i className="bi bi-cpu-fill display-1 text-info"></i>
        </div>

        <h1 className="fw-bold mb-3">
          AI Internship Finder
        </h1>

        <p className="lead text-light mb-4">
          Discover internships tailored to your skills, interests, and future goals
          using AI-powered recommendations.
        </p>

        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Link to="/login" className="btn btn-info btn-lg px-4">
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Login
          </Link>

          <Link to="/register" className="btn btn-outline-light btn-lg px-4">
            <i className="bi bi-person-plus-fill me-2"></i>
            Get Started
          </Link>
        </div>

        <div className="row mt-5">
          <div className="col-md-4 mb-3">
            <i className="bi bi-lightning-charge-fill fs-2 text-warning"></i>
            <h5 className="mt-2">Smart Matching</h5>
            <p className="text-light small">
              AI matches internships based on your profile
            </p>
          </div>

          <div className="col-md-4 mb-3">
            <i className="bi bi-globe fs-2 text-info"></i>
            <h5 className="mt-2">Global Opportunities</h5>
            <p className="text-light small">
              Internships sourced from around the world
            </p>
          </div>

          <div className="col-md-4 mb-3">
            <i className="bi bi-bar-chart-fill fs-2 text-success"></i>
            <h5 className="mt-2">Personalized Insights</h5>
            <p className="text-light small">
              Ranked recommendations just for you
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
