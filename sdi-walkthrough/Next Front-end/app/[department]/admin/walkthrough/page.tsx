"use client";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ScrollArea } from "@/components/ui/scroll-area";
import WalkthroughCard from "./WalkthroughCard";
import api from "@/lib/api";
import Modal from "./modal";
import Button from "./button";

export default function WalkthroughPage({
  params,
}: {
  params: { department: string };
}) {
  const [walkthroughs, setWalkthroughs] = useState([]);
  const [selectedWalkthrough, setSelectedWalkthrough] = useState("")

  React.useEffect(() => {
    api
      .get("/admin/walkthrough", { params: { department: params.department } })
      .then((res) => {
        console.log(res.data);
        setWalkthroughs(res.data);
      })
      .catch((err) => {
        toast.error(
          `Failed to fetch walkthrough because ${err.response.data.error}`
        );
      });
  }, [params.department]);

  const handleCreateNewWalkthrough = (name: String) => {
    api
      .post("/admin/walkthrough", { department: params.department, name: name })
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
    <div className="p-8">
      <div className="m-4 p-4 relative justify-center prose md:prose-lg max-w-full container">
        <h1 className="text-center">Admin - {params.department} Walkthrough</h1>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        closeOnClick
        theme="colored"
      />
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
      <select
        name="pickWalkthrough"
        id="pickWalkthrough"
        className="m-4 select select-bordered"
        defaultValue="Select a Walkthrough"
        onChange={(e) => setSelectedWalkthrough(e.target.value)}
      >
        {walkthroughs.length === 0 ? (
          <option disabled>Select a walkthrough</option>
        ) : (
          ""
        )}
        {walkthroughs.map((walkthrough) => (
          <option key={walkthrough} value={walkthrough}>
            {walkthrough}
          </option>
        ))}
      </select>
      <ScrollArea id="scroll-area" className="border min-h-screen">
        <WalkthroughCard />
      </ScrollArea>
    </div>
  );
}
