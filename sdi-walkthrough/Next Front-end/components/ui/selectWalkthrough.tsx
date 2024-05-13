import { useEffect } from "react";

export default function SelectWalkthrough({
  walkthroughs,
  selectedWalkthrough,
  onChange,
  className,
}: {
  walkthroughs: string[] | unknown;
  selectedWalkthrough: string;
  onChange: (walkthrough: string) => void;
  className?: string;
}) {
  useEffect(() => {
    if (!Array.isArray(walkthroughs)) return;
    if (walkthroughs.includes(selectedWalkthrough)) {
      onChange(selectedWalkthrough);
    }
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
        ? walkthroughs.map((walkthrough: string) => (
            <option key={walkthrough} value={walkthrough}>
              {walkthrough}
            </option>
          ))
        : null}
    </select>
  );
}
