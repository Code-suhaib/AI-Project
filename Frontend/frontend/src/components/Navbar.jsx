import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/dashboard">
        AI Internship Finder
      </Link>

      <div className="collapse navbar-collapse show">
        <ul className="navbar-nav ms-auto">
          {token ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/find-internships">
                  Find-internship
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/recommendations">
                  Recommendations
                </Link>
              </li>

              <li className="nav-item">
                <button
                  className="btn btn-outline-light ms-2"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
