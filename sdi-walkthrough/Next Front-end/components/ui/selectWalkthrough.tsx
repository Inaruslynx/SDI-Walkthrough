import { WalkthroughData } from "@/types";
import { useEffect } from "react";

export default function SelectWalkthrough({
  walkthroughs,
  selectedWalkthrough,
  onChange,
  className,
}: {
  walkthroughs?: WalkthroughData[];
  selectedWalkthrough: string;
  onChange: (walkthrough: string) => void;
  className?: string;
}) {
  useEffect(() => {
    if (!Array.isArray(walkthroughs)) return;
    walkthroughs.forEach(element => {
      if (element.name === selectedWalkthrough) {
        onChange(selectedWalkthrough);
      }
    });
  }, [selectedWalkthrough, onChange, walkthroughs]);

  return (
    <select
      className={`select select-bordered ${className}`}
      // defaultValue="Select a Walkthrough"
      value={selectedWalkthrough}
      onChange={(event) => onChange(event.target.value)}
    >
      <option disabled value="Select a Walkthrough">
        Select a Walkthrough
      </option>
      {Array.isArray(walkthroughs)
        ? walkthroughs.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))
        : null}
    </select>
  );
}
