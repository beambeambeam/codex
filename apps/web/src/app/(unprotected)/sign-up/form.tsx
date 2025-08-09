"use client";

import { useCallback, useId, useState } from "react";
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { useAppForm } from "@/components/ui/tanstack-form";
import { useQueryFetchClient } from "@/lib/api/client";
import { parseErrorDetail } from "@/lib/utils";
import FormProps from "@/types/form";

const signUpFormSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpFormSchemaType = z.infer<typeof signUpFormSchema>;

function SignUpForm(props: FormProps<SignUpFormSchemaType>) {
  const passwordId = useId();

  const { mutate, isPending } = useQueryFetchClient.useMutation(
    "post",
    "/api/v1/auth/register",
    {
      onSuccess: () => {
        toast.success("Account created successfully!");
      },
      onError: (error: unknown) => {
        toast.error(
          parseErrorDetail(error) ||
            "Failed to create account. Please try again.",
        );
      },
    },
  );

  const form = useAppForm({
    validators: { onChange: signUpFormSchema },
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      ...props.defaultValues,
    },
    onSubmit: async ({ value }) => {
      mutate({
        body: {
          ...value,
        },
      });
    },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState<boolean>(false);

  const togglePasswordVisibility = () =>
    setIsPasswordVisible((prevState) => !prevState);
  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible((prevState) => !prevState);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form],
  );

  // Password strength logic
  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score === 3) return "Medium password";
    return "Strong password";
  };

  return (
    <form.AppForm>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <form.AppField name="username">
          {(field) => (
            <field.FormItem>
              <field.FormDescription>
                This is your public display name.
              </field.FormDescription>
              <field.FormControl>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isPending}
                />
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        </form.AppField>

        <form.AppField name="email">
          {(field) => (
            <field.FormItem>
              <field.FormControl>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isPending}
                />
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        </form.AppField>

        <form.AppField name="password">
          {(field) => {
            const password = field.state.value || "";
            const strength = checkStrength(password);
            const strengthScore = strength.filter((req) => req.met).length;

            return (
              <field.FormItem>
                <field.FormControl>
                  <div className="relative">
                    <Input
                      id="password"
                      placeholder="Enter Password, Check the strength"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type={isPasswordVisible ? "text" : "password"}
                      aria-describedby={`${passwordId}-description`}
                      className="pe-9"
                      disabled={isPending}
                    />
                    <button
                      type="button"
                      className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md outline-none transition-[color,box-shadow] focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={togglePasswordVisibility}
                      aria-label={
                        isPasswordVisible ? "Hide password" : "Show password"
                      }
                      aria-pressed={isPasswordVisible}
                      aria-controls="password"
                      disabled={isPending}
                    >
                      {isPasswordVisible ? (
                        <EyeOffIcon size={16} aria-hidden="true" />
                      ) : (
                        <EyeIcon size={16} aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </field.FormControl>

                {password && (
                  <div className="mt-3">
                    <div
                      className="bg-border h-1 w-full overflow-hidden rounded-full"
                      role="progressbar"
                      aria-valuenow={strengthScore}
                      aria-valuemin={0}
                      aria-valuemax={4}
                      aria-label="Password strength"
                    >
                      <div
                        className={`h-full ${getStrengthColor(
                          strengthScore,
                        )} transition-all duration-500 ease-out`}
                        style={{ width: `${(strengthScore / 4) * 100}%` }}
                      ></div>
                    </div>

                    <p
                      id={`${passwordId}-description`}
                      className="text-foreground mb-2 mt-2 text-sm font-medium"
                    >
                      {getStrengthText(strengthScore)}. Must contain:
                    </p>

                    <ul
                      className="space-y-1.5"
                      aria-label="Password requirements"
                    >
                      {strength.map((req, index) => (
                        <li key={index} className="flex items-center gap-2">
                          {req.met ? (
                            <CheckIcon
                              size={16}
                              className="text-emerald-500"
                              aria-hidden="true"
                            />
                          ) : (
                            <XIcon
                              size={16}
                              className="text-muted-foreground/80"
                              aria-hidden="true"
                            />
                          )}
                          <span
                            className={`text-xs ${
                              req.met
                                ? "text-emerald-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            {req.text}
                            <span className="sr-only">
                              {req.met
                                ? " - Requirement met"
                                : " - Requirement not met"}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <field.FormMessage />
              </field.FormItem>
            );
          }}
        </form.AppField>

        <form.AppField name="confirmPassword">
          {(field) => (
            <field.FormItem>
              <field.FormControl>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    placeholder="Confirm password again."
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    className="pe-9"
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md outline-none transition-[color,box-shadow] focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={toggleConfirmPasswordVisibility}
                    aria-label={
                      isConfirmPasswordVisible
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    aria-pressed={isConfirmPasswordVisible}
                    aria-controls="confirmPassword"
                    disabled={isPending}
                  >
                    {isConfirmPasswordVisible ? (
                      <EyeOffIcon size={16} aria-hidden="true" />
                    ) : (
                      <EyeIcon size={16} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        </form.AppField>

        <Button
          type="submit"
          disabled={props.disabled || isPending}
          variant="secondary"
          className="mt-4 w-full"
        >
          {isPending ? (
            <>
              <Loader variant="circular" size="sm" className="mr-2" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </form.AppForm>
  );
}

export default SignUpForm;
