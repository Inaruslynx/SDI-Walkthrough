import { Walkthrough } from "@/types";
import { useEffect } from "react";

export default function SelectWalkthrough({
  walkthroughs,
  selectedWalkthrough = "",
  onChange,
  className,
}: {
  walkthroughs?: Walkthrough[];
  selectedWalkthrough: string;
  onChange: (walkthrough: string) => void;
  className?: string;
}) {
  // useEffect(() => {
  //   if (!Array.isArray(walkthroughs)) return;
  //   if (
  //     selectedWalkthrough === "Select a Walkthrough" ||
  //     selectedWalkthrough === ""
  //   )
  //     return;
  //   walkthroughs.forEach((element) => {
  //     if (element.name === selectedWalkthrough) {
  //       onChange(selectedWalkthrough);
  //     }
  //   });
  // }, [selectedWalkthrough, onChange, walkthroughs]);

  useEffect(() => {
    console.log("walkthroughs:", walkthroughs);
  }, [walkthroughs]);

  return (
    <select
      className={`select select-bordered ${className || ""}`}
      defaultValue="Select a Walkthrough"
      onChange={(event) => onChange(event.target.value)}
    >
      <option disabled value="Select a Walkthrough">
        Select a Walkthrough
      </option>
      {Array.isArray(walkthroughs)
        ? walkthroughs.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))
        : null}
    </select>
  );
}
