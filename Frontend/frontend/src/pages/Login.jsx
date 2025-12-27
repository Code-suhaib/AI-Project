import { useState } from "react";
import AuthLayout from "../layouts/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";
import { loginUser } from "../api/auth.api";

export default function Login() {
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
      window.location.href = "/recommendations";
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div
        className="card shadow p-4 auth-card"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <h3 className="text-center mb-3">
          <i className="bi bi-shield-lock-fill me-2"></i>
          Welcome Back
        </h3>

        <p className="text-center text-muted mb-4">
          Login to continue your AI internship journey
        </p>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <Input
          icon="bi-envelope"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          icon="bi-lock"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

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

        <p className="text-center mt-3 mb-0 text-muted">
          Don’t have an account?{" "}
          <a href="/register" className="text-decoration-none fw-semibold">
            Register
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}
