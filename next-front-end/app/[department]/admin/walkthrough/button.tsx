"use client";
import IconPlus from "@/components/ui/icons/plus";
import IconDelete from "@/components/ui/icons/delete";

type ButtonProps = {
  children: React.ReactNode;
  id: string;
  className?: string;
  type: "primary" | "error";
};

export default function Button({ children, id, type, className = '' }: ButtonProps) {
  return (
    <button
      className={`btn ${type === "primary" ? "btn-primary" : "btn-error"} rounded-btn ${className}`}
      onClick={() => {
        (document.getElementById(id) as HTMLDialogElement)?.showModal();
      }}
    >
      {type === "primary" ? <IconPlus /> : <IconDelete />}
      {children}
    </button>
  );
}
