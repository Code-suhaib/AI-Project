import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm px-3"
      style={{
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* LOGO */}
      <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
        <span
          className="d-inline-flex align-items-center justify-content-center rounded-circle me-2"
          style={{
            width: "35px",
            height: "35px",
            background: "linear-gradient(135deg, #6366f1, #06b6d4)",
            color: "white",
          }}
        >
          <i className="bi bi-robot"></i>
        </span>
        <span style={{ color: "#1e293b" }}>
          AI Finder
        </span>
      </Link>

      {/* MOBILE TOGGLE */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* MENU */}
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto align-items-lg-center">

          {token ? (
            <>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/find-internships">
                  Find Internships
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-dark" to="/recommendations">
                  Recommendations
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-dark" to="/upload-resume">
                  Upload Resume
                </Link>
              </li>

              <li className="nav-item mt-2 mt-lg-0">
                <button
                  className="btn btn-primary ms-lg-3 px-3"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/login">
                  Login
                </Link>
              </li>

              <li className="nav-item mt-2 mt-lg-0">
                <Link
                  className="btn btn-primary ms-lg-3 px-3"
                  to="/register"
                >
                  Get Started
                </Link>
              </li>
            </>
          )}

        </ul>
      </div>
    </nav>
  );
}