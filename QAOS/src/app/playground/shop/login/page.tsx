import Link from "next/link";
import { LoginForm } from "@/components/playground/shop/auth/login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm space-y-4">
      <h1 className="text-xl font-bold">Log In</h1>
      <LoginForm />
      <p className="text-sm text-muted-foreground">
        No account? <Link href="/playground/shop/register" className="text-primary underline">Register</Link>
      </p>
    </div>
  );
}
