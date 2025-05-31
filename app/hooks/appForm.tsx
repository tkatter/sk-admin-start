import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import InputField from "~/components/form/InputField";
import SelectField from "~/components/form/SelectField";
import DatePickerField from "~/components/form/DatePickerField";
import FieldCheckBox from "~/components/form/FieldCheckBox";
import SubmitButton from "~/components/form/SubmitButton";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    InputField,
    SelectField,
    DatePickerField,
    FieldCheckBox,
  },
  formComponents: {
    SubmitButton,
  },
});
