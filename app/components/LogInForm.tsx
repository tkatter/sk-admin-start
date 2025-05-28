import { AnyFieldApi, useForm } from "@tanstack/react-form";
import { formOpts, SignInFormSchema } from "~/lib/tanstack/form-utils";
import { log } from "~/lib/utils";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { authClient } from "~/lib/auth/auth-client";
import { LoadingSpinnerMini } from "./ui/LoadingSpinner";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const signIn = async (data: SignInFormSchema) => {
  const { email, password } = data;
  const { error, data: response } = await authClient.signIn.email({
    email,
    password,
    callbackURL: "/dashboard",
  });

  if (error) throw new Error(error.message);

  return response;
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

function LoginForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signInMutation = useMutation({
    mutationFn: signIn,
    onSuccess: (response) => {
      queryClient.resetQueries();
      navigate({ to: "/dashboard" });
      toast.success(`Hey ${response.user.name}, welcome back!`);
    },
  });

  const form = useForm({
    ...formOpts.userSignIn(),
    onSubmit: async ({ value }) => {
      await signInMutation.mutateAsync(value);
    },
  });
  return (
    <Card className="w-2xl">
      <CardHeader>
        <CardTitle className="text-3xl">Login</CardTitle>
        <CardDescription className="text-lg">
          Login to continue to SK Carpentry's admin page
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
            name="email"
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  type="email"
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
                {isSubmitting ? <LoadingSpinnerMini /> : "Submit"}
              </Button>
            )}
          />
        </form>
      </CardContent>
      <CardFooter className="self-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-slate-100 hover:underline">
            Create an account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default LoginForm;
