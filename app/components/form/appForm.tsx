import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import InputField from "~/components/form/InputField";
import SelectField from "./SelectField";
import DatePickerField from "./DatePickerField";

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    InputField,
    SelectField,
    DatePickerField,
  },
  formComponents: {},
});
