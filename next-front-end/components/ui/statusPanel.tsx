import { Walkthrough } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export default function StatusPanel({
  status,
  className = "",
}: {
  status: "loading" | "error" | "success";
  className?: string;
  }) {
    const walkthroughQuery = useQuery<AxiosResponse<Walkthrough[]>, Error>({
    queryKey: ["walkthroughs", "logs"],
    queryFn: () => findAllUsers(),
    staleTime: 1000 * 60 * 5, // ms s min
  });
  
  return (
    <div className={`status-panel ${className}`}>
      {status === "loading" && <p>Loading...</p>}
      {status === "error" && <p>Error occurred. Please try again.</p>}
      {status === "success" && <p>Operation successful!</p>}
    </div>
  );
}