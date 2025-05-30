import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useFieldContext } from "~/components/form/appForm";
import { Textarea } from "../ui/textarea";

function InputField({
  label,
  placeholder = "",
  type = "input",
}: {
  label?: string;
  placeholder?: string;
  type?: "input" | "area";
}) {
  const field = useFieldContext<string>();

  return (
    <div className="flex flex-col items-start gap-3">
      {label && <Label>{label}</Label>}
      {type === "input" ? (
        <Input
          placeholder={placeholder}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
        />
      ) : (
        <Textarea
          placeholder={placeholder}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
        />
      )}
    </div>
  );
}

export default InputField;
