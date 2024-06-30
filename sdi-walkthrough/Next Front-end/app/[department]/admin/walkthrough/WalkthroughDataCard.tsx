"use client";
import type { DataPoint } from "@/types";
// import { max } from "date-fns";
import { ReactNode, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import IconSave from "@/components/ui/icons/save";
import IconDelete from "@/components/ui/icons/delete";
import IconEdit from "@/components/ui/icons/edit";

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
  dataPoint: DataPoint;
  parentArea: string;
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
    control,
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
      choices: dataPoint?.choices || [],
    },
  });

  const queryClient = useQueryClient();
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [newChoice, setNewChoice] = useState<string>("");
  const [_id, setId] = useState<string>("");
  const choice = useWatch({
    control,
    name: "type",
    defaultValue: dataPoint?.type || "number",
  });

  useEffect(() => {
    if (dataPoint && dataPoint._id) {
      setId(dataPoint._id);
    }
  }, [dataPoint]);

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
      parentArea: parentArea,
      parentWalkthrough: selectedWalkthrough,
      choices: Array.isArray(formData.choices)
        ? formData.choices
        : [formData.choices],
    };
    try {
      await updateWalkthroughMutation.mutateAsync({
        selectedWalkthrough,
        action: "update",
        parentArea: parentArea,
        parentWalkthrough: selectedWalkthrough,
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

  const handleCancelClick = () => {
    setCanEdit(false);
    setValue("choices", []);
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
      <div
        className={`card m-4 ${canEdit ? "w-1/4" : "w-96"} bg-base-200 text-base-content shadow-lg shadow-base-300`}
      >
        <div className="card-body items-center text-center">
          <div className="card-title">Data Point</div>
          {canEdit ? (
            <>
              <DevTool control={control} />
              <form onSubmit={handleSubmit(handleSaveClick)}>
                <div>
                  <label>
                    Text to display
                    <input
                      type="text"
                      className={`input input-bordered m-2 focus:placeholder-transparent ${errors?.text ? "input-error" : ""}`}
                      placeholder="Enter displayed text"
                      {...register("text", { required: true })}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    What's to be recorded
                    <select
                      className={`select select-bordered m-2 ${errors?.type ? "input-error" : ""}`}
                      {...register("type", { required: true })}
                    >
                      <option value="number">Number</option>
                      <option value="string">Text</option>
                      <option value="boolean">Yes/No</option>
                    </select>
                  </label>
                </div>
                {choice === "number" && (
                  <>
                    <div>
                      <label>
                        Unit
                        <input
                          className={`input input-bordered m-2 focus:placeholder-transparent ${errors?.unit ? "input-error" : ""}`}
                          placeholder="Enter unit"
                          {...register("unit")}
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Minimum value
                        <input
                          type="text"
                          className={`input input-bordered m-2 focus:placeholder-transparent ${errors?.min ? "input-error" : ""}`}
                          placeholder="Enter minimum value"
                          {...register("min")}
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Max Value
                        <input
                          type="text"
                          className={`input input-bordered m-2 focus:placeholder-transparent ${errors?.max ? "input-error" : ""}`}
                          placeholder="Enter max value"
                          {...register("max")}
                        />
                      </label>
                    </div>
                  </>
                )}
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
                    getValues("choices").length > 0 &&
                    getValues("choices").map((choice, index) => (
                      <div key={index} className="flex items-center mt-2">
                        <div className="mr-2">{choice || "Blank"}</div>
                        <button
                          type="button"
                          className="btn btn-error btn-sm"
                          onClick={() => handleDeleteChoice(choice)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                </div>
                <button
                  type="submit"
                  className="btn btn-success btn-circle p-2 mt-4"
                >
                  <IconSave />
                </button>
              </form>
            </>
          ) : (
            <h2>{dataPoint?.text || "New Data Point"}</h2>
          )}
        </div>
        <div className="card-actions justify-end items-baseline">
          {!canEdit ? (
            <>
              <button
                className="btn btn-primary btn-circle p-2 m-1 mr-2 mb-2"
                onClick={handleEditClick}
              >
                <IconEdit />
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-primary" onClick={handleCancelClick}>
                Cancel
              </button>
              <button
                className="btn btn-error btn-circle p-2 m-1 mr-2 mb-2"
                onClick={handleDeleteClick}
              >
                <IconDelete />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
