import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"


export default function WalkthroughPage({
  params,
}: {
  params: { department: string };
}) {
  return <div className="p-16">
    <div className="row m-4 p-4 relative justify-center prose md:prose-lg max-w-full container">
    {params.department} Walkthrough
    
    </div>
  </div>;
}
