<<<<<<< HEAD
=======
import { getWalkthroughs } from "@/lib/api";
import { Walkthrough } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

>>>>>>> b4c46e61970fb7fa4849b07c2d96b7f4c514ff28
export default function StatusPanel({
  status,
  className = "",
}: {
  status: "loading" | "error" | "success";
  className?: string;
<<<<<<< HEAD
}) {
=======
  }) {
    const walkthroughQuery = useQuery<AxiosResponse<Walkthrough[]>, Error>({
    queryKey: ["walkthroughs", "logs"],
    queryFn: () => getWalkthroughs(),
    staleTime: 1000 * 60 * 5, // ms s min
  });
  
>>>>>>> b4c46e61970fb7fa4849b07c2d96b7f4c514ff28
  return (
    <div className={`status-panel ${className}`}>
      {status === "loading" && <p>Loading...</p>}
      {status === "error" && <p>Error occurred. Please try again.</p>}
      {status === "success" && <p>Operation successful!</p>}
    </div>
  );
}