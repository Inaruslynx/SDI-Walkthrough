"use client";
import type { DataPoint } from "@/types";
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
import { createDataPoint, updateDataPoint, deleteDataPoint } from "@/lib/api";
import { useOrganization } from "@clerk/nextjs";

const dataPointSchema = z.object({
  text: z.string().min(1, "Text is required"),
  type: z.union([
    z.literal("number"),
    z.literal("string"),
    z.literal("boolean"),
    z.literal("choice"),
  ]),
  unit: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  choices: z.string().array().optional(),
});

interface FormValues {
  text: string;
  type: "number" | "string" | "boolean" | "choice";
  unit?: string;
  min?: string;
  max?: string;
  choices: string[] | string;
}

interface WalkthroughDataCardProps {
  selectedWalkthrough: string;
  dataPoint: DataPoint;
  parentArea: string;
  namePassDown: string;
  onDeleteClick: () => void;
}

export default function WalkthroughDataCard({
  selectedWalkthrough,
  dataPoint,
  parentArea,
  namePassDown,
  onDeleteClick,
}: WalkthroughDataCardProps): ReactNode {
  console.log("namePassDown in DataCard:", namePassDown);
  // React Hook Form controller
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
    reset,
    trigger,
  } = useForm({
    resolver: zodResolver(dataPointSchema),
    defaultValues: {
      text: dataPoint?.text || "New Data Point",
      type: dataPoint?.type || "number",
      unit: dataPoint?.unit || "%",
      min: dataPoint?.min,
      max: dataPoint?.max,
      choices: dataPoint?.choices || [],
    },
  });

  const queryClient = useQueryClient();
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [newChoice, setNewChoice] = useState<string>("");
  const [editChoiceIndex, setEditChoiceIndex] = useState<number | null>(null);
  const [editChoiceValue, setEditChoiceValue] = useState<string>("");
  const [_id, setId] = useState<string>("");
  const typeChoice = useWatch({
    control,
    name: "type",
    defaultValue: dataPoint?.type || "number",
  });
  const { organization } = useOrganization();

  const initialFormValues = {
    text: dataPoint?.text || "New Data Point",
    type: dataPoint?.type || "number",
    unit: dataPoint?.unit || "%",
    min: dataPoint?.min,
    max: dataPoint?.max,
    choices: dataPoint?.choices || [],
  };

  useEffect(() => {
    if (dataPoint?._id) {
      setId(dataPoint._id);
    }
  }, [dataPoint._id]);

  const handleEditClick = () => {
    setCanEdit(true);
  };

  const createDataPointMutation = useMutation({
    mutationFn: (data: DataPoint) => createDataPoint(data, organization!.id),
    onSuccess: () => {
      toast.success("Successfully created Data Point.");
      queryClient.invalidateQueries({
        queryKey: ["walkthrough", { id: selectedWalkthrough }],
      });
    },
    onError: (err) => {
      toast.error(`Failed to create Data Point: ${err}.`);
    },
  });

  const updateDataPointMutation = useMutation({
    mutationFn: (data: DataPoint) => updateDataPoint(data, organization!.id),
    onSuccess: () => {
      toast.success("Successfully updated Data Point.");
      queryClient.invalidateQueries({
        queryKey: ["walkthrough", { id: selectedWalkthrough }],
      });
    },
    onError: (err) => {
      toast.error(`Failed to update Data Point: ${err}`);
    },
  });

  const deleteDataPointMutation = useMutation({
    mutationFn: (id: string) => deleteDataPoint(id, organization!.id),
    onSuccess: () => {
      toast.success("Successfully deleted Data Point.");
      queryClient.invalidateQueries({
        queryKey: ["walkthrough", { id: selectedWalkthrough }],
      });
    },
    onError: (err) => {
      toast.error(`Failed to delete Data Point: ${err}`);
    },
  });

  const handleSaveClick = async (formData: FormValues) => {
    const dataPointPackage: DataPoint = {
      _id: _id,
      text: formData.text,
      name: namePassDown,
      type: formData.type,
      unit: formData.unit,
      min: formData.min?.toString(),
      max: formData.max?.toString(),
      parentArea: parentArea,
      parentWalkthrough: selectedWalkthrough,
      choices: Array.isArray(formData.choices)
        ? formData.choices
        : [formData.choices],
    };

    try {
      if (dataPoint.isNew) {
        await createDataPointMutation.mutateAsync(dataPointPackage);
      } else {
        await updateDataPointMutation.mutateAsync(dataPointPackage);
      }
    } catch (error) {
      console.error(error);
    }
    setCanEdit(false);
  };

  const handleDeleteClick = async () => {
    try {
      if (dataPoint._id) {
        await deleteDataPointMutation.mutateAsync(dataPoint._id);
      } else {
        onDeleteClick();
      }
    } catch (e) {
      console.log("Error deleting data point:", e);
    }
  };

  const handleCancelClick = () => {
    setCanEdit(false);
    reset(initialFormValues);
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

  const handleDeleteChoice = async (choiceToDelete: string) => {
    console.log("in handleDeleteChoice");
    const currentChoices = getValues("choices");
    const currentChoicesArray = Array.isArray(currentChoices)
      ? currentChoices
      : [currentChoices];
    const updatedChoices = currentChoicesArray.filter(
      (choice) => choice !== choiceToDelete
    );
    console.log("updatedChoice:", updatedChoices);
    setValue("choices", updatedChoices);
    await trigger("choices");
  };

  const handleEditChoice = (index: number, value: string) => {
    setEditChoiceIndex(index);
    setEditChoiceValue(value);
  };

  const handleUpdateChoice = async (index: number) => {
    const currentChoices = getValues("choices");
    const updatedChoices = [...currentChoices];
    updatedChoices[index] = editChoiceValue;
    setValue("choices", updatedChoices);
    await trigger("choices");
    setEditChoiceIndex(null);
    setEditChoiceValue("");
  };

  const handleCancelEditChoice = () => {
    setEditChoiceIndex(null);
    setEditChoiceValue("");
  };

  return (
    <>
      <div
        className={`card m-4 ${canEdit ? "2xl:w-1/4 lg:w-1/2" : "w-96"} bg-base-200 text-base-content shadow-lg shadow-base-300`}
      >
        <div className="card-body p-4 items-center text-center">
          <div className="card-title">Data Point</div>
          {canEdit ? (
            <>
              <DevTool control={control} />
              <form onSubmit={handleSubmit(handleSaveClick)}>
                <div>
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">Text to display</span>
                    </div>
                    <input
                      type="text"
                      className={`input input-bordered m-2 focus:placeholder-transparent ${errors?.text ? "input-error" : ""}`}
                      placeholder="Enter displayed text"
                      {...register("text", { required: true })}
                    />
                    {errors?.text && (
                      <div className="label text-error">
                        <span>{errors.text.message}</span>
                      </div>
                    )}
                  </label>
                </div>
                <div>
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">
                        What&apos;s to be recorded
                      </span>
                    </div>
                    <select
                      className={`select select-bordered m-2 ${errors?.type ? "input-error" : ""}`}
                      {...register("type", { required: true })}
                    >
                      <option value="number">Number</option>
                      <option value="boolean">Yes/No</option>
                      <option value="choice">Choice</option>
                      <option value="string">Log</option>
                    </select>
                    {errors?.type && (
                      <div className="label">
                        <span>{errors.type.message}</span>
                      </div>
                    )}
                  </label>
                </div>
                {typeChoice === "number" && (
                  <>
                    <div>
                      <label className="form-control">
                        <div className="label">
                          <span className="label-text">Unit</span>
                        </div>
                        <input
                          className={`input input-bordered m-2 focus:placeholder-transparent ${errors?.unit ? "input-error" : ""}`}
                          placeholder="Enter unit"
                          {...register("unit")}
                        />
                        {errors?.unit && (
                          <div>
                            <span className="label-text-alt text-error">
                              {errors.unit.message}
                            </span>
                          </div>
                        )}
                      </label>
                    </div>
                    <div>
                      <label className="form-control">
                        <div className="label">
                          <span className="label-text">Minimum value</span>
                        </div>
                        <input
                          type="number"
                          className={`input input-bordered m-2 focus:placeholder-transparent ${errors?.min ? "input-error" : ""}`}
                          placeholder="Enter minimum value"
                          {...register("min", {
                            setValueAs: (v) => v || null,
                            valueAsNumber: true,
                          })}
                        />
                        {errors?.min && (
                          <div className="label">
                            <span className="label-text">
                              {errors.min.message}
                            </span>
                          </div>
                        )}
                      </label>
                    </div>
                    <div>
                      <label className="form-control">
                        <div className="label">
                          <span className="label-text">Max Value</span>
                        </div>
                        <input
                          type="number"
                          className={`input input-bordered m-2 focus:placeholder-transparent ${errors?.max ? "input-error" : ""}`}
                          placeholder="Enter max value"
                          {...register("max", {
                            setValueAs: (v) => v || null,
                            valueAsNumber: true,
                          })}
                        />
                        {errors?.max && (
                          <div className="label">
                            <span className="label-text">
                              {errors.max.message}
                            </span>
                          </div>
                        )}
                      </label>
                    </div>
                  </>
                )}
                {typeChoice === "choice" && (
                  <div className="mt-2">
                    <h3 className="font-bold mb-2">Choices</h3>
                    <div className="flex items-center">
                      <div className="join">
                        <input
                          type="text"
                          className="input input-bordered join-item"
                          value={newChoice}
                          onChange={(e) => setNewChoice(e.target.value)}
                          placeholder="Add new choice"
                        />
                        <button
                          type="button"
                          className="btn btn-primary join-item"
                          onClick={handleAddChoice}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    {Array.isArray(getValues("choices")) &&
                      getValues("choices").length > 0 && (
                        <div className="flex flex-col items-center mt-2">
                          {getValues("choices").map((choice, index) => (
                            <div key={index} className="join m-1">
                              {editChoiceIndex === index ? (
                                <>
                                  <input
                                    type="text"
                                    className="input input-bordered input-sm join-item"
                                    value={editChoiceValue}
                                    onChange={(e) =>
                                      setEditChoiceValue(e.target.value)
                                    }
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-success btn-sm join-item"
                                    onClick={() => handleUpdateChoice(index)}
                                  >
                                    Update
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-secondary btn-sm join-item"
                                    onClick={handleCancelEditChoice}
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <span className="join-item p-2">
                                    {choice || "Blank"}
                                  </span>
                                  <button
                                    type="button"
                                    className="btn btn-warning btn-sm join-item"
                                    onClick={() =>
                                      handleEditChoice(index, choice)
                                    }
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-error btn-sm join-item"
                                    onClick={() => handleDeleteChoice(choice)}
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                )}
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
                className="btn btn-accent btn-circle p-2 m-1 mr-2 mb-2"
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
