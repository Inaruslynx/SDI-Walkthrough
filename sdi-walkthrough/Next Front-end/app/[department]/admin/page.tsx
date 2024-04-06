import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function AdminPage({
  params,
}: {
  params: { department: string };
}) {
  return (
    <>
      <div className="p-8 grid grid-cols-12">
        <div className="col-span-2 p-4">
          <div className="text-center">
            <h4>Side Menu</h4>
            <p>users</p>
            <p>walkthrough</p>
          </div>
        </div>
        <div className="col-span-10">
          <div className="p-4 justify-center prose md:prose-lg max-w-full container">
            <h1 className="text-center">{params.department} Admin</h1>
          </div>
        </div>
      </div>
    </>
  );
}
