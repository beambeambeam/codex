"use client";

import Link from "next/link";

import SignInForm from "@/app/(unprotected)/sign-in/form";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";

function SignInPage() {
  return (
    <div className="grid h-screen grid-cols-1 lg:grid-cols-2">
      <div className="hidden h-full flex-col items-center justify-center lg:flex">
        <div>
          <Logo size={250} />
          <p className="text-2xl font-bold">Make every data, Askable.</p>
        </div>
      </div>
      <div className="flex h-full flex-col items-center justify-center gap-2.5 p-3">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl">
              🤗 Create an Account and Join us today.
            </CardTitle>
            <CardDescription className="text-sm">
              Sign in to your account and continue managing your data.
            </CardDescription>
          </CardHeader>
          <SignInForm
            defaultValues={{
              username: "",
              password: "",
            }}
          />
        </Card>
        <p className="text-accent-foreground/60">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up">
            <b>Register now!</b>
          </Link>
        </p>
      </div>
    </div>
  );
}
export default SignInPage;
