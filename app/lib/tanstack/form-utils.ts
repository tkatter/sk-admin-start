import { formOptions } from "@tanstack/react-form";
import { User } from "../types/form-types";
import { z } from "zod/v4";

// const signUpFormSchema = z.object({
//   name: z
//     .string()
//     .min(2, { message: "Name must be > 2 characters" })
//     .trim()
//     .toLowerCase(),
//   email: z.email().trim().toLowerCase(),
//   password: z.string().min(8, "Password must be > 8 characters"),
// });

export const formOpts = {
  userSignUp: () => {
    const defaultUser: User = {
      name: "",
      email: "",
      password: "",
    };

    return formOptions({
      defaultValues: defaultUser,
      // validators: {
      //   onChange: signUpFormSchema,
      // },
    });
  },
};
