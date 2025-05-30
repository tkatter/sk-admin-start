import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useFieldContext } from "./appForm";

function SelectField({
  placeholder,
  label,
  options,
  defaultValue,
}: {
  placeholder?: string;
  label?: string;
  options: Array<string>;
  defaultValue?: string;
}) {
  const field = useFieldContext<string>();

  return (
    <div className="flex flex-col items-start gap-3">
      {label && <Label>{label}</Label>}
      <Select
        value={field.state.value}
        onValueChange={(v) => field.handleChange(v)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt, i) => (
            <SelectItem value={opt} key={i}>
              <span className="capitalize">{opt}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectField;
