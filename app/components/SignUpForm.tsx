import type { AnyFieldApi } from "@tanstack/react-form";
import type { SignUpFormSchema } from "~/lib/tanstack/form-utils";

import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { LoadingSpinnerMini } from "~/components/ui/LoadingSpinner";
import { authClient } from "~/lib/auth/auth-client";
import { formOpts } from "~/lib/tanstack/form-utils";
import { log } from "~/lib/utils";

const signUp = async (data: SignUpFormSchema) => {
  const { error, data: res } = await authClient.signUp.email({
    email: data.email,
    password: data.password,
    name: data.name,
  });

  if (error) throw new Error(error.message);

  return res;
};

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <p className="text-destructive-foreground">
          {field.state.meta.errors.map((err) => err.message).join(",")}
        </p>
      ) : null}
      {/* {field.state.meta.isValidating ? "Validating..." : null} */}
    </>
  );
}

function SignUpForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const navigate = useNavigate();

  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      toast.success("Account created successfully.");

      queryClient.resetQueries();
      router.invalidate();
      navigate({ to: "/dashboard" });
    },
    onError: (error) => {
      toast.error(`Sign up failed: ${error.message}`);
    },
  });

  const form = useForm({
    ...formOpts.userSignUp(),
    onSubmit: async ({ value }) => {
      await signUpMutation.mutateAsync(value);
    },
  });

  return (
    <Card className="w-2xl">
      <CardHeader>
        <CardTitle className="text-3xl">Sign Up</CardTitle>
        <CardDescription className="text-lg">
          Sign up to continue to SK Carpentry's admin page
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="name"
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Name</Label>
                <Input
                  id={field.name}
                  type="text"
                  placeholder="John Doe"
                  required
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </>
            )}
          />
          <form.Field
            name="email"
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  type="email"
                  required
                  placeholder="example@gmail.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </>
            )}
          />
          <form.Field
            name="password"
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  type="password"
                  required
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </>
            )}
          />
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting || signUpMutation.isPending ? (
                  <LoadingSpinnerMini />
                ) : (
                  "Create Account"
                )}
              </Button>
            )}
          />
        </form>
      </CardContent>
      <CardFooter className="self-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/sign-in" className="text-slate-100 hover:underline">
            Log in here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default SignUpForm;
