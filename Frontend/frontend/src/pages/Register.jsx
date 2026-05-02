import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";
import { registerUser } from "../api/auth.api";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await registerUser({ name, email, password });

      setSuccess("Account created successfully 🎉");

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
                background: "linear-gradient(135deg, #06b6d4, #6366f1)",
                color: "white"
              }}
            >
              <i className="bi bi-person-plus-fill fs-4"></i>
            </div>

            <h3 className="fw-bold mb-1">Create Account</h3>
            <p className="text-muted small mb-0">
              Start your AI-powered internship journey
            </p>
          </div>

          {/* ALERTS */}
          {error && (
            <div className="alert alert-danger py-2 text-center small">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success py-2 text-center small">
              {success}
            </div>
          )}

          {/* INPUTS */}
          <div className="mb-3">
            <Input
              icon="bi-person"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
          <Button onClick={handleRegister} disabled={loading}>
            {loading ? (
              "Creating..."
            ) : (
              <>
                <i className="bi bi-check-circle-fill me-2"></i>
                Create Account
              </>
            )}
          </Button>

          {/* FOOTER */}
          <p className="text-center mt-4 mb-0 small text-muted">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="fw-semibold text-primary"
              style={{ cursor: "pointer" }}
            >
              Login
            </span>
          </p>

        </div>
      </div>
    </AuthLayout>
  );
}