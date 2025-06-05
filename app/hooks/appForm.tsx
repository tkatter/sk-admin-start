import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import InputField from "~/components/form/InputField";
import SelectField from "~/components/form/SelectField";
// import DatePickerField from "~/components/form/DatePickerField";
import FieldCheckBox from "~/components/form/FieldCheckBox";
import SubmitButton from "~/components/form/SubmitButton";
import DatePickerFieldV2 from "~/components/form/DatePickerV2";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    InputField,
    SelectField,
    // DatePickerField,
    DatePickerFieldV2,
    FieldCheckBox,
  },
  formComponents: {
    SubmitButton,
  },
});
