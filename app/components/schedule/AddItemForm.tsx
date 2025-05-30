import { useRef } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { NewScheduleItem, ScheduleItem } from "~/lib/types/schedule-types";
import { Button } from "~/components/ui/button";

import { Calendar } from "~/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { STATES } from "~/lib/constants";
import { cn, formatLocation } from "~/lib/utils";
import { DialogClose } from "~/components/ui/dialog";
import { addScheduleItem } from "~/lib/serverFns/schedule.api";

const locationSchema = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2).optional(),
  zip: z.string().optional(),
});

const formSchema = z.object({
  name: z.string().trim().toLowerCase().nonempty("Name cannot be empty"),
  status: z.enum(["pending", "confirmed", "in-progress"]),
  location: locationSchema.optional(),
  dates: z
    .object({
      from: z.date().min(new Date(Date.now()), "Cannot start in the past"),
      to: z.date(),
    })
    .required(),
});

function AddItemForm() {
  const queryClient = useQueryClient();
  const closeRef = useRef<HTMLButtonElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      status: undefined,
      location: {
        address: "",
        city: "",
        state: "mn",
        zip: "",
      },
      dates: {
        from: undefined,
        to: undefined,
      },
    },
  });

  const { mutate: addItem } = useMutation({
    mutationKey: ["addScheduleItem"],
    mutationFn: (newItem: NewScheduleItem) => addScheduleItem(newItem),
    onSuccess: () => {
      toast.success("Item added");
      if (closeRef.current) closeRef.current.click();
    },
    onError: (err) => {
      toast.error(`${err.message}`);
    },
    onSettled: () => {
      form.reset();
      return queryClient.invalidateQueries({ queryKey: ["scheduleItems"] });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newItem: NewScheduleItem = {
      name: values.name,
      status: values.status,
      startDate: values.dates.from,
      endDate: values.dates.to,
      location: {
        ...values.location,
        formatted: formatLocation(values.location || null),
      },
    };
    addItem(newItem);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full cursor-pointer">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in-progress">In-Progress</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="location.address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Address" />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-[2fr_1fr_1fr] gap-x-4">
            <FormField
              control={form.control}
              name="location.city"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="City" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location.state"
              render={({ field }) => (
                <FormItem>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STATES.map((s, i) => (
                        <SelectItem key={i} value={s.value}>
                          {s.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location.zip"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="Zip" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="dates"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dates</FormLabel>
              <Popover modal>
                <PopoverTrigger asChild>
                  <Button
                    name="date"
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal cursor-pointer"
                    )}
                  >
                    <CalendarIcon />
                    {/* eslint-disable-next-line */}
                    {field.value.from ? (
                      // eslint-disable-next-line
                      field.value.to ? (
                        <>
                          {format(field.value.from, "LLL dd, y")} -{" "}
                          {format(field.value.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(field.value.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Select dates</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0"
                  align="center"
                  side="bottom"
                >
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={field.value.from}
                    selected={{
                      from: field.value.from,
                      to: field.value.to,
                    }}
                    onSelect={field.onChange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="cursor-pointer">
          Save
        </Button>
        <DialogClose ref={closeRef} className="hidden" />
      </form>
    </Form>
  );
}

export default AddItemForm;
