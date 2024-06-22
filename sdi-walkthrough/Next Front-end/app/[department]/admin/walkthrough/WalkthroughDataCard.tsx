"use client";
import type { DataPoint, Area } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { max } from "date-fns";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { saveAreaMutationFn } from "./util";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const dataPointSchema = z.object({
  text: z.string().min(1, "Text is required"),
  type: z.union([
    z.literal("number"),
    z.literal("string"),
    z.literal("boolean"),
  ]),
  unit: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  choices: z.string().array().optional(),
});

interface FromValues {
  text: string;
  type: "number" | "string" | "boolean";
  unit?: string;
  min?: number;
  max?: number;
  choices: string[] | string;
}

interface WalkthroughDataCardProps {
  selectedWalkthrough: string;
  dataPoint?: DataPoint;
  parentArea?: string;
}

export default function WalkthroughDataCard({
  selectedWalkthrough,
  dataPoint,
  parentArea,
}: WalkthroughDataCardProps): ReactNode {
  // React Hook Form controller
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(dataPointSchema),
    defaultValues: {
      text: dataPoint?.text || "New Data Point",
      type: dataPoint?.type || "number",
      unit: dataPoint?.unit || "%",
      min: dataPoint?.min || 0,
      max: dataPoint?.max || 100,
      choices: dataPoint?.choices || [""],
    },
  });

  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [newChoice, setNewChoice] = useState<string>("");
  const [_id, setId] = useState<string>("");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (dataPoint && dataPoint._id) {
      setId(dataPoint._id);
    }
  }, [dataPoint]);

  const updateWalkthroughMutation = useMutation({
    mutationFn: saveAreaMutationFn,
    onSuccess: () => {
      toast.success("Successfully updated walkthrough.");
      queryClient.invalidateQueries({
        queryKey: ["walkthrough", { name: selectedWalkthrough }],
      });
    },
  });

  const handleEditClick = () => {
    setCanEdit(true);
  };

  const handleSaveClick = async (formData: FromValues) => {
    const dataPointPackage: DataPoint = {
      _id: _id,
      text: formData.text,
      type: formData.type,
      unit: formData.unit,
      min: formData.min,
      max: formData.max,
      choices: Array.isArray(formData.choices)
        ? formData.choices
        : [formData.choices],
    };
    try {
      await updateWalkthroughMutation.mutateAsync({
        selectedWalkthrough,
        action: "update",
        parentArea: parentArea,
        dataPoint: dataPointPackage,
      });
      setCanEdit(false);
      toast.success("Successfully updated data point.");
    } catch (error) {
      console.error(error);
      toast.error(`Failed to update data point due to ${error}`);
    }
  };

  const handleDeleteClick = async () => {
    if (dataPoint?.text) {
      const dataPointPackage: DataPoint = {
        _id: dataPoint._id,
        text: dataPoint.text,
        type: dataPoint?.type || "string",
      };
      try {
        await updateWalkthroughMutation.mutateAsync({
          selectedWalkthrough,
          action: "delete",
          parentArea: parentArea,
          dataPoint: dataPointPackage,
        });
        toast.success("Successfully deleted area.");
      } catch (e) {
        toast.error(`Failed to delete data point due to ${e}`);
      }
    }
  };

  const handleAddChoice = () => {
    const currentChoices = getValues("choices");
    const currentChoicesArray = Array.isArray(currentChoices)
      ? currentChoices
      : [currentChoices];
    if (newChoice && !currentChoicesArray.includes(newChoice)) {
      const updatedChoices = [...currentChoicesArray, newChoice];
      setValue("choices", updatedChoices);
      setNewChoice("");
    }
  };

  const handleDeleteChoice = (choiceToDelete: string) => {
    const currentChoices = getValues("choices");
    const currentChoicesArray = Array.isArray(currentChoices)
      ? currentChoices
      : [currentChoices];
    const updatedChoices = currentChoicesArray.filter(
      (choice) => choice !== choiceToDelete
    );
    setValue("choices", updatedChoices);
  };

  return (
    <>
      <div className="card m-4 w-96 bg-base-200 text-base-content shadow-lg shadow-base-200">
        <div className="card-body">
          {canEdit ? (
            <>
              <form onSubmit={handleSubmit(handleSaveClick)}>
                <input
                  type="text"
                  className={`input input-bordered focus:placeholder-transparent ${errors?.text ? "input-error" : ""}`}
                  placeholder="Enter displayed text"
                  {...register("text", { required: true })}
                />
                <select
                  className={`select select-bordered ${errors?.type ? "input-error" : ""}`}
                  {...register("type", { required: true })}
                >
                  <option value="number">Number</option>
                  <option value="string">Text</option>
                  <option value="boolean">Boolean</option>
                </select>
                <input
                  className={`input input-bordered focus:placeholder-transparent ${errors?.unit ? "input-error" : ""}`}
                  placeholder="Enter unit"
                  {...register("unit")}
                />
                <input
                  className={`input input-bordered focus:placeholder-transparent ${errors?.min ? "input-error" : ""}`}
                  placeholder="Enter minimum value"
                  {...register("min")}
                />
                <input
                  type="text"
                  className={`input input-bordered focus:placeholder-transparent ${errors?.min ? "input-error" : ""}`}
                  placeholder="Enter max value"
                />
                <div className="mt-2">
                  <h3 className="font-bold mb-2">Choices</h3>
                  <div className="flex items-center">
                    <input
                      type="text"
                      className="input input-bordered mr-2"
                      value={newChoice}
                      onChange={(e) => setNewChoice(e.target.value)}
                      placeholder="Add new choice"
                    />
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleAddChoice}
                    >
                      Add
                    </button>
                  </div>
                  {Array.isArray(getValues("choices")) &&
                    getValues("choices").map((choice, index) => (
                      <div key={index} className="flex items-center mt-2">
                        <span className="mr-2">{choice}</span>
                        <button
                          type="button"
                          className="btn btn-error btn-sm"
                          onClick={() => handleDeleteChoice(choice)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  ;
                </div>
                <button type="submit" className="btn btn-success mt-4">
                  Save
                </button>
              </form>
            </>
          ) : (
            <h2>{dataPoint?.text || "New Data Point"}</h2>
          )}
        </div>
        <div className="card-actions">
          <button className="btn btn-primary" onClick={handleEditClick}>
            Edit
          </button>
          <button className="btn btn-error" onClick={handleDeleteClick}>
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
