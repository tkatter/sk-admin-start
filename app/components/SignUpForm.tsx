import { useForm } from "@tanstack/react-form";
import { formOpts } from "~/lib/tanstack/form-utils";
import { log } from "~/lib/utils";
import { Input } from "~/components/ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { z } from "zod/v4";

function SignUpForm() {
  const form = useForm({
    ...formOpts.userSignUp(),
    onSubmit: ({ value }) => {
      log(value);
    },
  });

  return (
    <Card className="w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl">Sign Up</CardTitle>
        <CardDescription className="text-lg">
          Sign up to continue to SK Carpentry's admin page
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
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
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors && (
                  <p className="text-destructive-foreground">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
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
                  placeholder="example@gmail.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
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
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            )}
          />
          <form.Subscribe
            selector={(state) => state.errors}
            children={(errors) => (
              <>
                {errors.length > 0 && (
                  <p className="text-destructive-foreground">
                    {errors.join(", ")}
                  </p>
                )}
              </>
            )}
          />
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          size={"lg"}
          variant={"outline"}
          onClick={(e) => {
            e.preventDefault();
            form.reset();
          }}
        >
          Reset
        </Button>
        <Button size={"lg"} variant={"default"} onClick={form.handleSubmit}>
          Sign Up
        </Button>
      </CardFooter>
    </Card>
  );
}

export default SignUpForm;
