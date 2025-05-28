import { PlusCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import AddItemForm from "~/components/schedule/AddItemForm";

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
          <DialogTitle>Add Item</DialogTitle>
          <DialogDescription>Add a new schedule item here.</DialogDescription>
        </DialogHeader>
        <AddItemForm />
      </DialogContent>
    </Dialog>
  );
}

export default AddItemDialog;
