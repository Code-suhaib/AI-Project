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
      window.location.href = "/dashboard";
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "420px" }}>
        <h3 className="text-center mb-3">AI Internship Finder</h3>
        <p className="text-center text-muted mb-4">
          Sign in to continue
        </p>

        {error && (
          <div className="alert alert-danger py-2">{error}</div>
        )}

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
          {loading ? "Signing in..." : "Login"}
        </Button>
      </div>
    </AuthLayout>
  );
}
