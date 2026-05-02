import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";
import { loginUser } from "../api/auth.api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.data.token);

      navigate("/find-internships");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="container d-flex justify-content-center align-items-center min-vh-100 px-3">
        
        <div
          className="card border-0 shadow-lg p-4 p-md-5 w-100"
          style={{
            maxWidth: "420px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(10px)"
          }}
        >

          {/* HEADER */}
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{
                width: "60px",
                height: "60px",
                background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                color: "white"
              }}
            >
              <i className="bi bi-robot fs-4"></i>
            </div>

            <h3 className="fw-bold mb-1">Welcome Back</h3>
            <p className="text-muted small mb-0">
              Continue your AI-powered internship journey
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="alert alert-danger py-2 text-center small">
              {error}
            </div>
          )}

          {/* INPUTS */}
          <div className="mb-3">
            <Input
              icon="bi-envelope"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <Input
              icon="bi-lock"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* BUTTON */}
          <Button onClick={handleLogin} disabled={loading}>
            {loading ? (
              "Logging in..."
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Login
              </>
            )}
          </Button>

          {/* FOOTER */}
          <p className="text-center mt-4 mb-0 small text-muted">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="fw-semibold text-primary"
              style={{ cursor: "pointer" }}
            >
              Register
            </span>
          </p>

        </div>
      </div>
    </AuthLayout>
  );
}