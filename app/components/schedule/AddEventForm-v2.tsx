import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import FieldInfo from "~/components/form/FieldInfo";
import { LoadingSpinnerMini } from "~/components/ui/LoadingSpinner";
import { useAppForm } from "~/hooks/appForm";
import { STATES } from "~/lib/constants";
import { addScheduleItem as addScheduleItemServerFn } from "~/lib/serverFns/schedule.api";
import { formOpts } from "~/lib/tanstack/form-utils";
import {
  createScheduleItemSchema,
  type NewScheduleItem,
} from "~/lib/types/schedule-types";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "../ui/button";

function AddEventForm() {
  const queryClient = useQueryClient();
  const addScheduleItem = useServerFn(addScheduleItemServerFn);

  const { mutate: addEvent, isPending } = useMutation({
    mutationFn: async (newEvent: NewScheduleItem) =>
      await addScheduleItem({ data: newEvent }),
    onSuccess: () => {
      form.reset();
      toast.success("Event added!");
      queryClient.invalidateQueries({ queryKey: ["scheduleItems"] });
    },
  });

  const form = useAppForm({
    ...formOpts.addScheduleItem(),
    onSubmit: ({ value }) => {
      const res = createScheduleItemSchema.safeParse(value);
      if (!res.success) return form.reset();

      if (res.data.hasLocation && res.data.location) {
        const { address, city, state, zip } = res.data.location;
        res.data.location.formatted = `${address}, ${city}, ${state} ${zip}`;
      }

      addEvent(res.data);
    },
  });

  return (
    <>
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
            <div>
              <field.InputField label="Event Name" />
              <FieldInfo field={field} className="mt-1" />
            </div>
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
                  type="string"
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
                  type="string"
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
          validators={{
            onSubmit: ({ fieldApi, value }) => {
              if (!value || !fieldApi.form.getFieldValue("endDate")) {
                return { message: "Dates are required" };
              }
            },
          }}
          children={(field) => (
            <div>
              <field.DatePickerField label="Dates" className="w-full" />
              <FieldInfo field={field} className="mt-1" />
            </div>
          )}
        />
        <form.Subscribe
          selector={(state) => state.values.hasLocation}
          children={(hasLocation) =>
            hasLocation && (
              <div className="flex flex-col gap-4">
                <form.AppField
                  name="location.address"
                  validators={{
                    onChangeListenTo: ["hasLocation"],
                    onChange: ({ fieldApi, value }) => {
                      if (
                        fieldApi.form.getFieldValue("hasLocation") &&
                        !value
                      ) {
                        return { message: "Address is required" };
                      } else return;
                    },
                  }}
                  children={(field) => {
                    return (
                      <div>
                        <field.InputField label="Street Address" />
                        <FieldInfo field={field} className="mt-1" />
                      </div>
                    );
                  }}
                />
                <div className="grid items-center grid-cols-[1fr_min-content_1fr] grid-rows-[min-content_min-content] gap-x-4">
                  <form.AppField
                    name="location.city"
                    validators={{
                      onChangeListenTo: ["hasLocation"],
                      onChange: ({ fieldApi, value }) => {
                        if (
                          fieldApi.form.getFieldValue("hasLocation") &&
                          !value
                        ) {
                          return { message: "City is required" };
                        } else return;
                      },
                    }}
                    children={(field) => (
                      <>
                        <div className="row-1 col-1">
                          <field.InputField label="City" />
                        </div>
                        <div className="row-2 col-1">
                          <FieldInfo field={field} />
                        </div>
                      </>
                    )}
                  />
                  <form.AppField
                    name="location.state"
                    validators={{
                      onChangeListenTo: ["hasLocation"],
                      onChange: ({ fieldApi, value }) => {
                        if (
                          fieldApi.form.getFieldValue("hasLocation") &&
                          !value
                        ) {
                          return { message: "State is required" };
                        } else return;
                      },
                    }}
                    children={(field) => (
                      <>
                        <div className="row-1 col-2">
                          <field.SelectField
                            label="State"
                            defaultValue="mn"
                            type="states"
                            options={STATES}
                          />
                        </div>
                        <div className="row-2 col-2">
                          <FieldInfo field={field} />
                        </div>
                      </>
                    )}
                  />
                  <form.AppField
                    name="location.zip"
                    validators={{
                      onChangeListenTo: ["hasLocation"],
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: ({ value }) => {
                        if (value && value?.length < 5)
                          return { message: "Invalid Zipcode" };
                      },
                      onChange: ({ fieldApi, value }) => {
                        if (
                          fieldApi.form.getFieldValue("hasLocation") &&
                          !value
                        ) {
                          return { message: "Zipcode is required" };
                        }
                      },
                    }}
                    children={(field) => (
                      <>
                        <div className="row-1 col-3">
                          <field.InputField label="Zipcode" />
                        </div>
                        <div className="row-2 col-3">
                          <FieldInfo field={field} className="mt-1" />
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
            )
          }
        />
        <form.AppField
          name="hasLocation"
          listeners={{
            onSubmit: ({ value, fieldApi }) => {
              if (!value) {
                return fieldApi.form.setFieldValue("location", null);
              } else return;
            },
          }}
          children={(field) => (
            <>
              <field.FieldCheckBox
                uncheckedText="Add location"
                checkedText="Remove location"
              />
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
        <form.AppForm>
          <form.SubmitButton>
            {!isPending ? "Submit" : <LoadingSpinnerMini />}
          </form.SubmitButton>
        </form.AppForm>
        <form.Subscribe
          selector={(state) => state.values}
          children={(values) => (
            <Button onClick={() => console.log(values)}>Debug</Button>
          )}
        />
      </form>
      <div></div>
    </>
  );
}

export default AddEventForm;
