"use client";
import StatusPanel from "@/components/ui/status-panel/StatusPanel";
import { Suspense, useEffect } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
// import { parseCookies, destroyCookie } from "nookies";

function HomeContent() {
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("reason") === "forbidden") {
      toast.error("You do not have access to that department's walkthrough");
    }
  }, [params]);

  return (
    <>
      <h1 className="text-5xl mb-8 text-center">
        <b>Welcome to SDI Walkthrough</b>
      </h1>
      <main className="px-12 bg-base-100 prose md:prose-lg text-base-content min-w-full">
        <StatusPanel className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
      </main>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
  // const params = useSearchParams();

  // useEffect(() => {
  //   if (params.get("reason") === "forbidden") {
  //     toast.error("You do not have access to that department's walkthrough");
  //   }
  // }, [params]);

  // useEffect(() => {
  //   const cookies = parseCookies();
  //   // console.log("checking cookies:", cookies);
  //   if (cookies.reason) {
  //     const reason = cookies.reason;
  //     if (reason === "forbidden") {
  //       destroyCookie(null, "reason");
  //       toast.error("You do not have access to that department's walkthrough");
  //     }
  //   } else {
  //     console.log("no reason cookie found");
  //   }
  // }, []);

  // return (
  //   <>
  //     <h1 className="text-5xl mb-8 justify-self-center self-center place-self-center text-center">
  //       <b>Welcome to SDI Walkthrough</b>
  //     </h1>
  //     <main className="px-12 bg-base-100 prose md:prose-lg text-base-content min-w-full">
  //       <StatusPanel className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
  //     </main>
  //   </>
  // );
}
