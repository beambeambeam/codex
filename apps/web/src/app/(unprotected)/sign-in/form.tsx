"use client";

import { useCallback, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import z from "zod";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppForm } from "@/components/ui/tanstack-form";
import FormProps from "@/types/form";

const signInFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type SignInFormSchemaType = z.infer<typeof signInFormSchema>;

function SignInForm(props: FormProps<SignInFormSchemaType>) {
  const form = useAppForm({
    validators: { onChange: signInFormSchema },
    defaultValues: {
      ...props.defaultValues,
    },
    onSubmit: ({ value }) => console.log(value),
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const togglePasswordVisibility = () =>
    setIsPasswordVisible((prevState) => !prevState);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form],
  );

  return (
    <form.AppForm>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <form.AppField name="username">
            {(field) => (
              <field.FormItem>
                <field.FormLabel>Username</field.FormLabel>
                <field.FormControl>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </field.FormControl>
                <field.FormMessage />
              </field.FormItem>
            )}
          </form.AppField>

          <form.AppField name="password">
            {(field) => (
              <field.FormItem>
                <field.FormLabel>Password</field.FormLabel>
                <field.FormControl>
                  <div className="relative">
                    <Input
                      id="password"
                      placeholder="••••••••"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type={isPasswordVisible ? "text" : "password"}
                      className="pe-9"
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
                    >
                      {isPasswordVisible ? (
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
        </CardContent>

        <CardFooter className="flex w-full items-center justify-center pt-5">
          <Button type="submit" disabled={props.disabled}>
            Sign In
          </Button>
        </CardFooter>
      </form>
    </form.AppForm>
  );
}

export default SignInForm;
