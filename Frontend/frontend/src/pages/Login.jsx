import AuthLayout from "../layouts/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";
import { loginUser } from "../api/auth.api";

export default function Login() {
  const handleLogin = async () => {
    const res = await loginUser({
      email: "test@test.com",
      password: "123456"
    });
    localStorage.setItem("token", res.data.token);
    window.location.href = "/dashboard";
  };

  return (
    <AuthLayout>
      <h3 className="text-center mb-4">AI Internship Finder</h3>
      <Input icon="bi-envelope" placeholder="Email" />
      <Input icon="bi-lock" type="password" placeholder="Password" />
      <Button onClick={handleLogin}>Continue</Button>
    </AuthLayout>
  );
}
