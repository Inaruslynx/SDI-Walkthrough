export default function StatusPanel({
  status,
  className = "",
}: {
  status: "loading" | "error" | "success";
  className?: string;
}) {
  return (
    <div className={`status-panel ${className}`}>
      {status === "loading" && <p>Loading...</p>}
      {status === "error" && <p>Error occurred. Please try again.</p>}
      {status === "success" && <p>Operation successful!</p>}
    </div>
  );
}