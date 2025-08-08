import Link from "next/link";

import SignUpForm from "@/app/(unprotected)/sign-up/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";

function SignUpPage() {
  return (
    <div className="grid h-screen grid-cols-1 lg:grid-cols-2">
      <div className="hidden h-full flex-col items-center justify-center lg:flex">
        <div>
          <Logo size={250} />
          <h1 className="text-3xl">Your&apos;s Agentic Ai Librarians</h1>
        </div>
      </div>
      <div className="flex h-full flex-col items-center justify-center gap-2.5">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">
              🤗 Create an Account and Join us today.
            </CardTitle>
            <CardDescription className="text-sm">
              Create your account and start managing your data with Codex, your
              intelligent data assistant.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm
              defaultValues={{
                email: "",
                username: "",
                password: "",
                confirmPassword: "",
              }}
            />
          </CardContent>
        </Card>
        <p className="text-accent-foreground/60">
          Already have an account?{" "}
          <Link href="/sign-in">
            <b>Sign in!</b>
          </Link>
        </p>
      </div>
    </div>
  );
}
export default SignUpPage;
