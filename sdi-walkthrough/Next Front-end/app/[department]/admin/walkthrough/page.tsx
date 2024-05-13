"use client";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ScrollArea } from "@/components/ui/scroll-area";
import WalkthroughCard from "./WalkthroughCard";
import {
  createWalkthrough,
  deleteWalkthrough,
  getWalkthrough,
  getWalkthroughs,
} from "@/lib/api";
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
  const [selectedWalkthrough, setSelectedWalkthrough] = useState(
    "Select a Walkthrough"
  );
  const walkthroughNameRef = useRef<HTMLInputElement>(null);
  const createWalkthroughModalRef = useRef<HTMLDialogElement>(null);
  const deleteWalkthroughModalRef = useRef<HTMLDialogElement>(null);

  // Fetch all walkthroughs for department
  const walkthroughs = useQuery<AxiosResponse<Walkthroughs>, Error>({
    queryKey: ["walkthrough", { department: params.department }],
    queryFn: () => getWalkthroughs(params.department),
    staleTime: 1000 * 60 * 5,
  });

  const selectedWalkthroughQuery = useQuery<AxiosResponse<Walkthrough>, Error>({
    queryKey: ["walkthrough", { name: selectedWalkthrough }],
    queryFn: () => getWalkthrough(selectedWalkthrough),
    staleTime: 1000 * 60 * 5,
    enabled: selectedWalkthrough !== "",
  });

  // Create new walkthrough
  const handleCreateNewWalkthrough = useMutation({
    mutationFn: async () => {
      const name = walkthroughNameRef.current?.value || "";

      return createWalkthrough(name, params.department);
    },
    onSuccess: (data) => {
      toast.success("Successfully created new walkthrough.");
      queryClient.invalidateQueries({ queryKey: ["walkthrough"] });
      setSelectedWalkthrough(data.data.name);
    },
    onError: () => {
      toast.error("Failed to create walkthrough.");
    },
  });

  const handleDeleteWalkthrough = useMutation({
    mutationFn: () => {
      return deleteWalkthrough(selectedWalkthrough);
    },
    onSuccess: () => {
      toast.success("Successfully deleted walkthrough.");
    },
    onError: () => {
      toast.error("Failed to delete walkthrough.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["walkthrough"] });
    },
  });

  // is this necessary?
  useEffect(() => {
    if (selectedWalkthrough !== "") {
      selectedWalkthroughQuery.refetch();
      // console.log("selectedWalkthrough", selectedWalkthroughQuery?.data?.data);
    }
  }, [selectedWalkthrough]);

  return (
    <div className="px-8 pb-4">
      <div className="mb-4 relative justify-center prose md:prose-lg max-w-full container">
        <h1 className="text-center">Admin - {params.department} Walkthrough</h1>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <Button id="walkthrough-dialog" type="primary">
            Create New Walkthrough
          </Button>
          <Modal
            id="walkthrough-dialog"
            type="primary"
            ref={createWalkthroughModalRef}
            targetInput={walkthroughNameRef}
            onClick={() => {
              handleCreateNewWalkthrough.mutate();
            }}
            onClose={() => {
              createWalkthroughModalRef.current?.close();
            }}
          >
            Create
          </Modal>
          <SelectWalkthrough
            className="align-end"
            selectedWalkthrough={selectedWalkthrough}
            walkthroughs={walkthroughs.data?.data?.walkthroughs}
            onChange={setSelectedWalkthrough}
          />
        </div>

        {selectedWalkthrough && (
          <div className="justify-end">
            <Button id="delete-walkthrough-dialog" type="error">
              Delete Walkthrough
            </Button>
            <Modal
              id="delete-walkthrough-dialog"
              type="error"
              ref={deleteWalkthroughModalRef}
              target={selectedWalkthrough}
              onClick={() => {
                handleDeleteWalkthrough.mutate();
              }}
              onClose={() => {
                deleteWalkthroughModalRef.current?.close();
              }}
            >
              Delete
            </Modal>
          </div>
        )}
      </div>

      <ScrollArea id="scroll-area" className="border min-h-screen">
        <WalkthroughCard />
      </ScrollArea>
    </div>
  );
}
