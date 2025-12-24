import AuthLayout from "../layouts/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Register() {
  return (
    <AuthLayout>
      <h3 className="text-center mb-4">Create Account</h3>
      <Input placeholder="Name" />
      <Input placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Button>Create</Button>
    </AuthLayout>
  );
}
