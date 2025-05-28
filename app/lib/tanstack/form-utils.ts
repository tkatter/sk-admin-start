import { z } from "zod/v4";
import { formOptions } from "@tanstack/react-form";
import { UserSignIn, UserSignUp } from "../types/form-types";

export const signUpFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be > 2 characters" })
    .trim()
    .toLowerCase(),
  email: z.email("Invalid email").trim().toLowerCase(),
  password: z.string().min(8, "Password must be > 8 characters"),
});

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;

export const signInFormSchema = z.object({
  email: z.email("Invalid email").trim().toLowerCase(),
  password: z.string().min(8, "Password must be > 8 characters"),
});

export type SignInFormSchema = z.infer<typeof signInFormSchema>;

export const formOpts = {
  userSignUp: () => {
    const defaultUser: UserSignUp = {
      name: "",
      email: "",
      password: "",
    };

    return formOptions({
      defaultValues: defaultUser,
      validators: {
        onChange: signUpFormSchema,
      },
    });
  },
  userSignIn: () => {
    const defaultUser: UserSignIn = {
      email: "",
      password: "",
    };

    return formOptions({
      defaultValues: defaultUser,
      validators: {
        onSubmit: signInFormSchema,
      },
    });
  },
};
