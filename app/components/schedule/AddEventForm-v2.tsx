import { useAppForm } from "~/components/form/appForm";
import FieldInfo from "../form/FieldInfo";
import { formOpts } from "~/lib/tanstack/form-utils";
import { log } from "~/lib/utils";

function AddEventForm() {
  const form = useAppForm({
    ...formOpts.addScheduleItem(),
    onSubmit: ({ value }) => {
      log(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-6"
    >
      <form.AppField
        name="name"
        children={(field) => (
          <>
            <field.InputField label="Event Name" />
            <FieldInfo field={field} />
          </>
        )}
      />
      <form.AppField
        name="description"
        children={(field) => (
          <>
            <field.InputField
              label="Description"
              type="area"
              placeholder="Event description"
            />
            <FieldInfo field={field} />
          </>
        )}
      />
      <div className="flex items-center w-full gap-4">
        <form.AppField
          name="status"
          children={(field) => (
            <div className="w-full">
              <field.SelectField
                label="Status"
                placeholder="Status"
                options={[
                  "pending",
                  "confirmed",
                  "in-progress",
                  "completed",
                  "cancelled",
                ]}
              />
              <FieldInfo field={field} />
            </div>
          )}
        />
        <form.AppField
          name="eventType"
          children={(field) => (
            <div className="w-full">
              <field.SelectField
                label="Type"
                placeholder="Event Type"
                options={["job", "meeting", "event", "appointment"]}
              />
              <FieldInfo field={field} />
            </div>
          )}
        />
      </div>
      <form.AppField
        name="startDate"
        children={(field) => (
          <>
            <field.DatePickerField className="w-full" />
            <FieldInfo field={field} />
          </>
        )}
      />
      <form.AppField
        name="location.address"
        children={(field) => (
          <>
            <field.InputField label="Street Address" />
            <FieldInfo field={field} />
          </>
        )}
      />
      <form.AppField
        name="location.city"
        children={(field) => (
          <>
            <field.InputField label="City" />
            <FieldInfo field={field} />
          </>
        )}
      />
      <form.AppField
        name="location.zip"
        children={(field) => (
          <>
            <field.InputField label="Zipcode" />
            <FieldInfo field={field} />
          </>
        )}
      />
      <form.AppField
        name="location.state"
        children={(field) => (
          <>
            <field.InputField label="State" />
            <FieldInfo field={field} />
          </>
        )}
      />
      <form.AppField
        name="notes"
        children={(field) => (
          <>
            <field.InputField
              label="Notes"
              type="area"
              placeholder="Other details or information"
            />
            <FieldInfo field={field} />
          </>
        )}
      />
    </form>
  );
}

export default AddEventForm;
