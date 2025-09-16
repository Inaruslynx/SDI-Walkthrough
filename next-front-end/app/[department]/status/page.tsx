"use client";

import StatusPanel from "@/components/ui/status-panel/DynamicStatusPanel";
import { useParams } from "next/navigation";

export default function StatusPage() {
  const { department } = useParams<{ department: string }>();
  return (
    <>
      <h1 className="text-5xl mb-8 justify-self-center self-center place-self-center text-center">
        <b>{department} Walkthroughs Status</b>
      </h1>
      <main className="px-12 bg-base-100 prose md:prose-lg text-base-content justify-self-center self-center place-self-center min-w-full">
        <StatusPanel
          department={department}
          className="mx-auto grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        />
      </main>
    </>
  );
}
