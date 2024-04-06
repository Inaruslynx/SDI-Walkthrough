"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import IconPlus from "@/components/ui/icons/plus";
import WalkthroughCard from "./WalkthroughCard";

export default function WalkthroughPage({
  params,
}: {
  params: { department: string };
}) {
  return (
    <div className="p-8">
      <div className="m-4 p-4 relative justify-center prose md:prose-lg max-w-full container">
        <h1 className="text-center">Admin - {params.department} Walkthrough</h1>
      </div>
      <button
        className="btn btn-primary m-4 px-4 py-2 rounded-btn"
        onClick={() => {
          (
            document.getElementById("walkthrough-dialog") as HTMLDialogElement
          )?.showModal();
        }}
      >
        <IconPlus />
        Create New Walkthrough
      </button>
      <dialog id="walkthrough-dialog" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center">
            Name New Walkthrough
          </h3>
          <div className="modal-action">
            <form method="dialog" className="w-full justify-center">
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
              />
              <div className="container flex justify-center">
                <button className="btn btn-primary m-2" type="button">
                  Create
                </button>
                <button className="btn btn-error m-2">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
      <select
        name="pickWalkthrough"
        id="pickWalkthrough"
        className="m-4 select select-bordered"
        defaultValue="Select a Walkthrough"
      ></select>
      <ScrollArea id="scroll-area" className="border">
        <WalkthroughCard />
      </ScrollArea>
    </div>
  );
}
