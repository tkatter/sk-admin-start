import { PlusCircle } from "lucide-react";
import AddEventForm from "~/components/schedule/AddEventForm-v2";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

function AddItemDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <p className="max-sm:hidden">Add item</p>
          <PlusCircle />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
          <DialogDescription>Add a new event here.</DialogDescription>
        </DialogHeader>
        <AddEventForm />
      </DialogContent>
    </Dialog>
  );
}

export default AddItemDialog;
