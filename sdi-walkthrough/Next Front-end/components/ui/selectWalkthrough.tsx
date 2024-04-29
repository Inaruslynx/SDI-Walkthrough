export default function SelectWalkthrough({
  walkthroughs,
  defaultSelection,
  disabledSelection,
  onChange,
}: {
  walkthroughs: string[];
  defaultSelection: string;
  disabledSelection: string;
  onChange: (walkthrough: string) => void;
}) {
  return (
    <select
      className="select select-bordered"
      defaultValue={defaultSelection}
      onChange={(event) => onChange(event.target.value)}
    >
      {walkthroughs.map((walkthrough) => (
        <option
          key={walkthrough}
          value={walkthrough}
          disabled={walkthrough === disabledSelection}
        >
          {walkthrough}
        </option>
      ))}
    </select>
  );
}
