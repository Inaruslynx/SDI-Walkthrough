"use client";
import { ReactNode, useEffect, useMemo, useState } from "react";
import IconEdit from "@/components/ui/icons/edit";
import IconSave from "@/components/ui/icons/save";
import IconDelete from "@/components/ui/icons/delete";
import IconPlus from "@/components/ui/icons/plus";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { DevTool } from "@hookform/devtools";
import type { Area } from "@/types";
// import { createArea, updateArea, deleteArea } from "@/lib/api";
// import { useOrganization } from "@clerk/nextjs";
import { useDeleteArea, useSaveNewArea, useSaveUpdatedArea } from "./mutations";

const nameSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

interface FormValues {
  name: string;
}

interface WalkthroughAreaCardProps {
  selectedWalkthrough: string;
  area?: Area;
  onAreaSave?: () => void;
  onAddArea: (parentArea: Area) => void;
  onAddDataPoint: (parentArea: Area) => void;
  onToggleVisibility: () => void;
  isVisible: boolean;
}

export default function WalkthroughAreaCard({
  selectedWalkthrough,
  area = {
    index: 0,
    _id: "",
    name: "",
    parentType: "walkthrough",
    parentWalkthrough: selectedWalkthrough,
    areas: [],
    dataPoints: [],
  },
  onAreaSave,
  onAddArea,
  onAddDataPoint,
  onToggleVisibility,
  isVisible,
}: WalkthroughAreaCardProps): ReactNode {
  // React Hook Form controller
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name: area?.name || "",
    },
  });

  const [canEdit, setCanEdit] = useState<boolean>(false);
  const name = useWatch({ control, name: "name" });
  // const queryClient = useQueryClient();
  const initialFormValues = useMemo<FormValues>(
    () => ({
      name: area?.name || "",
    }),
    [area?.name]
  );
  // const { organization } = useOrganization();

  const createAreaMutation = useSaveNewArea(selectedWalkthrough, onAreaSave);

  //   useMutation({
  //   mutationFn: (data: Area) => createArea(data, organization!.id),
  //   onSuccess: () => {
  //     toast.success("Successfully created Area.");
  //     queryClient.invalidateQueries({
  //       queryKey: ["area", { walkthrough: selectedWalkthrough }],
  //     });
  //     queryClient.invalidateQueries({
  //       queryKey: ["walkthrough", { id: selectedWalkthrough }],
  //     });

  //     if (onAreaSave) {
  //       onAreaSave();
  //     }
  //   },
  // });

  const updateAreaMutation = useSaveUpdatedArea(
    area,
    selectedWalkthrough,
    onAreaSave
  );
  //   useMutation({
  //   mutationFn: (data: Area) => updateArea(data, organization!.id),
  //   onSuccess: () => {
  //     toast.success("Successfully updated Area.");
  //     queryClient.invalidateQueries({
  //       queryKey: ["area", { id: area._id }],
  //     });
  //     queryClient.invalidateQueries({
  //       queryKey: ["walkthrough", { id: selectedWalkthrough }],
  //     });

  //     if (onAreaSave) {
  //       onAreaSave();
  //     }
  //   },
  // });

  const deleteAreaMutation = useDeleteArea(selectedWalkthrough, onAreaSave);
  //   useMutation({
  //   mutationFn: (id: string) => deleteArea(id, organization!.id),
  //   onSuccess: () => {
  //     toast.success("Deleted Area.");
  //     queryClient.invalidateQueries({
  //       queryKey: ["area", { walkthrough: selectedWalkthrough }],
  //     });
  //     queryClient.invalidateQueries({
  //       queryKey: ["walkthrough", { id: selectedWalkthrough }],
  //     });

  //     if (onAreaSave) {
  //       onAreaSave();
  //     }
  //   },
  //   onError: (error) => {
  //     toast.error("Failed to delete Area. " + error);
  //   },
  // });

  const handleEditClick = () => {
    setCanEdit(true);
  };

  const handleCancelClick = () => {
    setCanEdit(false);
    reset(initialFormValues);
  };

  const handleSaveClick = async (formData: FormValues) => {
    // console.log("In handleSaveClick");
    const areaPackage: Area = {
      _id: area?._id || undefined,
      name: formData.name,
      parentType: area.parentType,
      parentWalkthrough: selectedWalkthrough,
      parentArea: area.parentArea || undefined,
      areas: area?.areas || [],
      dataPoints: area?.dataPoints || [],
    };
    try {
      if (area.isNew) {
        // console.log("creating a new area");
        await createAreaMutation.mutateAsync(areaPackage);
      } else {
        // console.log("updating area");
        await updateAreaMutation.mutateAsync(areaPackage);
      }
    } catch (e) {
      console.error(e);
    }
    setCanEdit(false);
  };

  const handleDeleteClick = async () => {
    try {
      if (area._id) {
        await deleteAreaMutation.mutateAsync({ id: area._id });
      } else {
        throw new Error("no area id.");
      }
    } catch (e) {
      toast.error(`Failed to delete area due to ${e}`);
    }
  };

  useEffect(() => {
    reset(initialFormValues);
  }, [reset, initialFormValues]);

  return (
    <div
      className={`card m-4 px-2 w-fit bg-base-200 text-base-content shadow-lg shadow-base-300`}
    >
      <div className="card-body items-center text-center">
        <div className="card-title">Area</div>
        {canEdit ? (
          <>
            <DevTool control={control} />
            <form onSubmit={handleSubmit(handleSaveClick)} id="formName">
              <label className="form-control">
                <div className="label">
                  <span className="label-text">Area</span>
                </div>
                <input
                  id="name"
                  className={`input input-bordered focus:placeholder-transparent ${errors?.name ? "input-error" : ""}`}
                  placeholder="New Area"
                  {...register("name")}
                />
                {errors?.name && (
                  <div className="label">
                    <span className="text-error">{errors.name.message}</span>
                  </div>
                )}
              </label>
              <button
                type="submit"
                title="Save Area"
                form="formName"
                className="btn btn-success btn-circle p-2 m-2"
                onClick={handleSubmit(handleSaveClick)}
              >
                <IconSave />
              </button>
            </form>
          </>
        ) : (
          <h2>{name || "New Area"}</h2>
        )}
      </div>
      <div className="card-actions justify-end items-baseline">
        {canEdit ? (
          <>
            <button
              className="btn btn-primary p-2 m-2"
              onClick={handleCancelClick}
            >
              Cancel
            </button>
            <button
              className="btn btn-error btn-circle p-2 mr-2 mb-2"
              onClick={handleDeleteClick}
            >
              <IconDelete />
            </button>
          </>
        ) : (
          <>
            {area && area._id && (
              <>
                <button
                  title="Add Sub Area"
                  className="btn btn-primary m-1"
                  onClick={() => onAddArea(area)}
                >
                  <IconPlus /> Sub Area
                </button>
                <button
                  title="Add Data Point"
                  className="btn btn-primary m-1"
                  onClick={() => onAddDataPoint(area)}
                >
                  <IconPlus /> Data Point
                </button>
              </>
            )}
            <button
              title={isVisible ? "Hide Sub-Areas" : "Show Sub-Areas"}
              className="btn btn-warning p-2 m-1 mr-2 mb-2"
              onClick={onToggleVisibility}
            >
              {isVisible ? "Hide" : "Show"} Sub-Areas
            </button>
            <button
              title="Edit Area"
              className="btn btn-accent btn-circle p-2 m-1 mr-2 mb-2"
              onClick={handleEditClick}
            >
              <IconEdit />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
