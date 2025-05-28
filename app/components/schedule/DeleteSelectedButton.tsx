import { Trash2 } from "lucide-react";
import { useRef } from "react";
import { Button } from "~/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { useSchedule } from "~/context/ScheduleContext";

function DeleteSelectedButton() {
  const { rowSelection, deleteItemsDb } = useSchedule();
  const actionBtnRef = useRef<HTMLButtonElement>(null);
  const numberItemsSelected = Object.keys(rowSelection).length;

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (actionBtnRef.current) actionBtnRef.current.click();

    const itemIds = Object.keys(rowSelection);
    const itemIdsAsNumbers = itemIds.map((el) => Number(el));
    deleteItemsDb(itemIdsAsNumbers);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <p className="max-sm:hidden">{`Delete ${numberItemsSelected} ${
            numberItemsSelected === 1 ? "item" : "items"
          }`}</p>
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.{" "}
            {`${numberItemsSelected === 1 ? "This item" : "These items"}`} will
            be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant={"outline"}
            className="text-destructive-foreground border-destructive-foreground"
            onClick={(e) => handleDelete(e)}
          >
            Delete
          </Button>
          <AlertDialogAction className="hidden" ref={actionBtnRef} />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteSelectedButton;
