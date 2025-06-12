import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircleIcon } from "lucide-react";
import { z } from "zod/v4";
import FieldInfo from "~/components/form/FieldInfo";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { AlertDialog } from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { log } from "~/lib/utils";

export const Route = createFileRoute("/(app)/schedule/past")({
  component: RouteComponent,
});

const formSchema = z.object({
  username: z.string().min(3, "Username must be > 3 characters"),
  password: z
    .string()
    .min(8, "Password must be > 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain uppercase, lowercase, number, and special character",
    ),
});

function RouteComponent() {
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      if (!value.username || !value.password)
        return "Please fill in all fields";
      log(value);
    },
  });

  return (
    <div className="flex items-center justify-center size-full">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.Field
              name="username"
              children={(field) => (
                <div>
                  <Label className="mb-2" htmlFor={field.name}>
                    Username
                  </Label>
                  <Input
                    id={field.name}
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </div>
              )}
            />
            <form.Field
              name="password"
              children={(field) => (
                <div>
                  <Label className="mb-2" htmlFor={field.name}>
                    Password
                  </Label>
                  <Input
                    id={field.name}
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {/* {field.state.meta.errors.length > 0 && (
                    <Alert variant={"destructive"} className="mt-2">
                      <AlertCircleIcon />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        {field.state.meta.errors.map((el, i) =>
                          i === field.state.meta.errors.length - 1
                            ? el?.message
                            : `${el?.message}, `
                        )}
                      </AlertDescription>
                    </Alert>
                  )} */}
                </div>
              )}
            />
            {/* <form.Subscribe
              selector={(state) => state.errors}
              children={(errors) => {
                log(errors);
                return (
                  errors.length > 0 && (
                    <Alert variant={"destructive"} className="mt-2">
                      <AlertCircleIcon />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{}</AlertDescription>
                    </Alert>
                  )
                );
              }}
            /> */}
          </form>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Button
            variant={"outline"}
            onClick={(e) => {
              e.preventDefault();
              // e.stopPropagation();
              form.reset();
            }}
          >
            Reset
          </Button>
          <Button
            variant={"default"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            Submit
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
