"use client";
import IconPlus from "@/components/ui/icons/plus";
import IconDelete from "@/components/ui/icons/delete";

type ButtonProps = {
  children: React.ReactNode;
  id: string;
  type: "primary" | "error";
};

export default function Button({ children, id, type }: ButtonProps) {
  return (
    <button
      className={`btn ${type === "primary" ? "btn-primary" : "btn-error"} m-4 px-4 py-2 rounded-btn`}
      onClick={() => {
        (document.getElementById(id) as HTMLDialogElement)?.showModal();
      }}
    >
      {type === "primary" ? <IconPlus /> : <IconDelete />}
      {children}
    </button>
  );
}
