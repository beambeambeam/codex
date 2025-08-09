"use client";

import Link from "next/link";

import SignUpForm from "@/app/(unprotected)/sign-up/form";
import { Logo } from "@/components/ui/logo";

function SignUpPage() {
  return (
    <div className="grid h-screen grid-cols-1 lg:grid-cols-2">
      <div className="hidden h-full flex-col items-center justify-center lg:flex"></div>
      <div className="flex h-full flex-col items-center justify-center border-l">
        <div className="flex w-[80%] flex-col gap-8 lg:w-[60%]">
          <div className="flex flex-col">
            <Logo size={250} />
            <h1 className="text-3xl font-bold">
              Create an Account and Join us.
            </h1>
          </div>
          <div className="w-full">
            <SignUpForm
              defaultValues={{
                email: "",
                username: "",
                password: "",
                confirmPassword: "",
              }}
            />
          </div>
          <p className="text-accent-foreground/60 flex w-full flex-col items-center text-sm">
            Already have an account?{" "}
            <Link href="/sign-in">
              <b>Sign in!</b>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default SignUpPage;
