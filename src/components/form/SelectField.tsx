import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useFieldContext } from "../../hooks/appForm";

function SelectField({
  placeholder,
  label,
  options,
  type,
  defaultValue,
}: {
  placeholder?: string;
  label?: string;
  options: Array<any>;
  defaultValue?: string;
  type: "string" | "states";
}) {
  const field = useFieldContext<string>();

  return (
    <div className="flex flex-col items-start gap-3">
      {label && <Label>{label}</Label>}
      <Select
        value={field.state.value}
        onValueChange={(v) => field.handleChange(v)}
        // defaultValue={defaultValue}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {type === "string"
            ? options.map((opt, i) => (
                <SelectItem value={opt} key={i}>
                  <span className="capitalize">{opt}</span>
                </SelectItem>
              ))
            : options.map((opt, i) => (
                <SelectItem value={opt.value} key={i}>
                  <span className="uppercase">{opt.text}</span>
                </SelectItem>
              ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectField;
