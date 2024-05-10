export default function SelectWalkthrough({
  walkthroughs,
  onChange,
}: {
  walkthroughs: string[] | unknown;
  onChange: (walkthrough: string) => void;
}) {
  return (
    <select
      className="select select-bordered"
      defaultValue="Select a Walkthrough"
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
