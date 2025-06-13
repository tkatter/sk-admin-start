import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import CreateBid from "~/components/bids/CreateBid";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/(app)/bids/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div>Hello "/(app)/bids/"!</div>
      <div className="flex size-full flex-col justify-center items-center">
        <Button
          className="w-full cursor-pointer"
          variant="default"
          onClick={() => {
            console.log("CLICK");
            setShowModal((prev) => !prev);
          }}
        >
          Create Bid
        </Button>
        {showModal && <CreateBid />}
      </div>
    </>
  );
}
