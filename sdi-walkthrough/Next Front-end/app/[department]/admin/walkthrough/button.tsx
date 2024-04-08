"use client";
import IconPlus from "@/components/ui/icons/plus";
export default function Button() {
  return (
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
  );
}
