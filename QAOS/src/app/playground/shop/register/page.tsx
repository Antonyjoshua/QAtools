import Link from "next/link";
import { RegisterForm } from "@/components/playground/shop/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-sm space-y-4">
      <h1 className="text-xl font-bold">Create an Account</h1>
      <RegisterForm />
      <p className="text-sm text-muted-foreground">
        Already have an account? <Link href="/playground/shop/login" className="text-primary underline">Log in</Link>
      </p>
    </div>
  );
}
