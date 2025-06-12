import { AnyFieldApi } from "@tanstack/react-form";

function FieldInfo({
  field,
  className = "",
}: {
  field: AnyFieldApi;
  className?: string;
}) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <p className={`text-destructive-foreground ${className}`}>
          {field.state.meta.errors.map((err) => err.message).join(",")}
        </p>
      ) : null}
      {/* {field.state.meta.isValidating ? "Validating..." : null} */}
    </>
  );
}

export default FieldInfo;
