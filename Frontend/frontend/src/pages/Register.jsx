import { useState } from "react";
import AuthLayout from "../layouts/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";
import { registerUser } from "../api/auth.api";

export default function Register() {
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

      setSuccess("Account created successfully. Please login.");
      setName("");
      setEmail("");
      setPassword("");

      // Redirect after short delay
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="card shadow p-4" style={{ maxWidth: "420px", width: "100%" }}>
        <h3 className="text-center mb-3">Create Account</h3>
        <p className="text-center text-muted mb-4">
          Start your AI-powered internship journey
        </p>

        {error && <div className="alert alert-danger py-2">{error}</div>}
        {success && <div className="alert alert-success py-2">{success}</div>}

        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={handleRegister} disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </Button>
      </div>
    </AuthLayout>
  );
}
