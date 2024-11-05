import DownArrow from "@/components/ui/icons/downArrow";
import UpArrow from "@/components/ui/icons/upArrow";

interface SortButtonProps {
    label: string;
    sortStatus: "asc" | "desc" | "none";
  onClick: () => void;
}

export default function SortButton({ label, sortStatus, onClick }: SortButtonProps) {
  return (
    <h3 role="button" className="whitespace-nowrap inline-flex items-center space-x-1" onClick={onClick}>
      {label}
      <span className="inline-flex items-center space-x-1">
        {sortStatus === "desc" ? <DownArrow /> : null}
        {sortStatus === "asc" ? <UpArrow /> : null}
      </span>
    </h3>
  );
}