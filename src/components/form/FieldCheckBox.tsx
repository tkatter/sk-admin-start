import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { useFieldContext } from "../../hooks/appForm";
import { Button } from "../ui/button";

function FieldCheckBox({
  uncheckedText,
  checkedText,
}: {
  uncheckedText?: string;
  checkedText?: string;
}) {
  const field = useFieldContext<boolean>();
  const [checked, setChecked] = useState<boolean>(field.state.value);

  return (
    <div className="w-full flex justify-center items-center">
      <Checkbox asChild={true} />
      <Button
        className="w-1/2"
        variant={"ghost"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setChecked((prev) => !prev);
          field.handleChange(!checked);
        }}
      >
        {!checked ? uncheckedText : checkedText}
      </Button>
    </div>
  );
}

export default FieldCheckBox;
