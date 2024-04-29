"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ScrollArea } from "@/components/ui/scroll-area";
import WalkthroughCard from "./WalkthroughCard";
import api from "@/lib/api";
import Modal from "./modal";
import Button from "./button";
import SelectWalkthrough from "@/components/ui/selectWalkthrough";

export default function WalkthroughPage({
  params,
}: {
  params: { department: string };
}) {
  const [walkthroughs, setWalkthroughs] = useState(["Select a Walkthrough"]);
  const [selectedWalkthrough, setSelectedWalkthrough] = useState("");

  React.useEffect(() => {
    api
      .get("walkthrough", { params: { department: params.department } })
      .then((res) => {
        // console.log(res.data);
        // console.log("Toast opening");
        toast.success("Got Walkthroughs!");
        setWalkthroughs([...walkthroughs, ...res.data.walkthroughs]);
      })
      .catch((err) => {
        toast.error(
          `Failed to fetch walkthrough because ${err.response.data.error}`
        );
      });
  }, [params.department]);

  const handleCreateNewWalkthrough = (name: String) => {
    api
      .post("walkthrough", { department: params.department, name: name })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Successfully created new walkthough.");
        }
      })
      .catch((err) => {
        toast.error(
          `Failed to create walkthrough because ${err.response.data.error}`
        );
      });
  };

  return (
    <div className="px-8 pb-4">
      <div className="mb-4 relative justify-center prose md:prose-lg max-w-full container">
        <h1 className="text-center">Admin - {params.department} Walkthrough</h1>
      </div>
      <Button />
      <Modal
        id="walkthrough-dialog"
        onClick={() => {
          handleCreateNewWalkthrough(
            (
              window.document.getElementById(
                "walkthroughName"
              ) as HTMLInputElement
            )?.value
          );
          (
            window.document.getElementById(
              "walkthrough-dialog"
            ) as HTMLDialogElement
          )?.close();
        }}
      >
        Create
      </Modal>
      <SelectWalkthrough
        walkthroughs={walkthroughs}
        defaultSelection={walkthroughs[0]}
        disabledSelection={walkthroughs[0]}
        onChange={setSelectedWalkthrough}
      />

      <ScrollArea id="scroll-area" className="border min-h-screen">
        <WalkthroughCard />
      </ScrollArea>
    </div>
  );
}
