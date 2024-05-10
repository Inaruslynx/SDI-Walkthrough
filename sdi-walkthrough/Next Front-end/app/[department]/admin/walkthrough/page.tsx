"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ScrollArea } from "@/components/ui/scroll-area";
import WalkthroughCard from "./WalkthroughCard";
import { createWalkthrough, getWalkthrough, getWalkthroughs } from "@/lib/api";
import Modal from "./modal";
import Button from "./button";
import SelectWalkthrough from "@/components/ui/selectWalkthrough";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Walkthrough, Walkthroughs } from "@/types";
import { AxiosResponse } from "axios";

export default function WalkthroughPage({
  params,
}: {
  params: { department: string };
}) {
  const queryClient = useQueryClient();
  const [selectedWalkthrough, setSelectedWalkthrough] = useState("");

  // Fetch all walkthroughs for department
  const walkthroughs = useQuery<AxiosResponse<Walkthroughs>, Error>({
    queryKey: ["walkthrough", { department: params.department }],
    queryFn: () => getWalkthroughs(params.department),
    staleTime: 1000 * 60 * 5,
  });

  // Create new walkthrough
  const handleCreateNewWalkthrough = useMutation({
    mutationFn: (name: string) => {
      return createWalkthrough(name, params.department);
    },
    onSuccess: () => {
      toast.success("Successfully created new walkthrough.");
      queryClient.invalidateQueries({ queryKey: ["walkthrough"] });
    },
    onError: () => {
      toast.error("Failed to create walkthrough.");
    },
  });

  const selectedWalkthroughQuery = useQuery<AxiosResponse<Walkthrough>, Error>({
    queryKey: ["walkthrough", { name: selectedWalkthrough }],
    queryFn: () => getWalkthrough(selectedWalkthrough),
    staleTime: 1000 * 60 * 5,
    enabled: selectedWalkthrough !== "",
  });

  // is this necessary?
  useEffect(() => {
    // TODO - load all of the areas and datapoints
    if (selectedWalkthrough !== "") {
      selectedWalkthroughQuery.refetch();
      console.log("selectedWalkthrough", selectedWalkthroughQuery?.data?.data);
    }
  }, [selectedWalkthrough]);

  return (
    <div className="px-8 pb-4">
      <div className="mb-4 relative justify-center prose md:prose-lg max-w-full container">
        <h1 className="text-center">Admin - {params.department} Walkthrough</h1>
      </div>
      <Button />
      <Modal
        id="walkthrough-dialog"
        onClick={() => {
          handleCreateNewWalkthrough.mutate(
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
        walkthroughs={walkthroughs.data?.data?.walkthroughs}
        onChange={setSelectedWalkthrough}
      />

      <ScrollArea id="scroll-area" className="border min-h-screen">
        <WalkthroughCard />
      </ScrollArea>
    </div>
  );
}
