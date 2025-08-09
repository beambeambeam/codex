"use client";

import Link from "next/link";

import SignInForm from "@/app/(unprotected)/sign-in/form";
import { Logo } from "@/components/ui/logo";

function SignInPage() {
  return (
    <div className="grid h-screen grid-cols-1 lg:grid-cols-2">
      <div className="hidden h-full flex-col items-center justify-center lg:flex"></div>
      <div className="flex h-full flex-col items-center justify-center border-l">
        <div className="flex w-[80%] flex-col gap-8 lg:w-[60%]">
          <div className="flex flex-col">
            <Logo size={250} />
            <h1 className="text-3xl font-bold">
              Welcome back, Let&apos;s get crashing.
            </h1>
          </div>
          <div className="w-full">
            <SignInForm />
          </div>
          <p className="text-accent-foreground/60 flex w-full flex-col items-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up">
              <b>Register now!</b>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default SignInPage;
