import { toast } from "react-toastify";
import {
  createArea,
  createDataPoint,
  createWalkthrough,
  deleteArea,
  deleteDataPoint,
  deleteWalkthrough,
  updateArea,
  updateDataPoint,
  updateWalkthrough,
} from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Area, DataPoint } from "@/types";
import { useOrganization } from "@clerk/nextjs";
import SelectWalkthrough from "../../../../components/ui/SelectWalkthrough";

export function useCreateWalkthrough(
  setSelectedWalkthrough: (name: string) => void,
  setAreas: (areas: Area[]) => void
) {
  const queryClient = useQueryClient();
  const { organization } = useOrganization();
  return useMutation({
    mutationFn: async ({
      name,
      department,
    }: {
      name: string;
      department: string;
    }) => await createWalkthrough(name, department, organization!.id),
    onSuccess: (data) => {
      toast.success("Successfully created new walkthrough.");
      queryClient.invalidateQueries({ queryKey: ["walkthrough"] });
      setSelectedWalkthrough(data.data.name);
      setAreas([
        {
          name: "",
          areas: [],
          dataPoints: [],
          parentType: "walkthrough",
          parentWalkthrough: data.data.name,
        },
      ]);
    },
    onError: () => toast.error("Failed to create walkthrough."),
  });
}

export function useRenameWalkthrough(
  setSelectedWalkthrough: (name: string) => void
) {
  const queryClient = useQueryClient();
  const { organization } = useOrganization();
  return useMutation({
    mutationFn: async ({ id, name }: { name: string; id: string }) =>
      await updateWalkthrough(
        id,
        organization!.id,
        name,
        undefined,
        undefined,
        undefined,
        false
      ),
    onSuccess: (data) => {
      toast.success("Successfully renamed walkthrough.");
      queryClient.invalidateQueries({ queryKey: ["walkthrough"] });
      setSelectedWalkthrough(data.data.name);
    },
    onError: () => toast.error("Failed to rename walkthrough."),
  });
}

export function useDeleteWalkthrough(
  setSelectedWalkthrough: (name: string) => void
) {
  const queryClient = useQueryClient();
  const { organization } = useOrganization();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) =>
      await deleteWalkthrough(id, organization!.id),
    onSuccess: () => {
      toast.success("Successfully deleted walkthrough.");
      setSelectedWalkthrough("Select a Walkthrough");
    },
    onError: () => {
      toast.error("Failed to delete walkthrough.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["walkthrough"] });
    },
  });
}

export function useSavePeriodicity() {
  const { organization } = useOrganization();
  return useMutation({
    mutationFn: async ({
      id,
      periodicity,
      weekly,
      perSwing,
    }: {
      id: string;
      periodicity?: string;
      weekly?: string;
      perSwing?: string;
    }) =>
      await updateWalkthrough(
        id,
        organization!.id,
        undefined,
        periodicity,
        weekly,
        perSwing,
        true
      ),
    onSuccess: () => {
      toast.success("Successfully changed periodicity.");
    },
    onError: () => {
      toast.error("Could not change periodicity.");
    },
  });
}

export function useSaveNewArea(
  selectedWalkthrough: string,
  onAreaSave?: () => void
) {
  const queryClient = useQueryClient();
  const { organization } = useOrganization();
  return useMutation({
    mutationFn: async (data: Area) => {
      await createArea(data, organization!.id);
    },
    onSuccess: () => {
      toast.success("Successfully created Area.");
      queryClient.invalidateQueries({
        queryKey: ["area", { walkthrough: selectedWalkthrough }],
      });
      queryClient.invalidateQueries({
        queryKey: ["walkthrough", { id: selectedWalkthrough }],
      });

      if (onAreaSave) {
        onAreaSave();
      }
    },
  });
}

export function useSaveUpdatedArea(
  area: Area,
  selectedWalkthrough: string,
  onAreaSave?: () => void
) {
  const queryClient = useQueryClient();
  const { organization } = useOrganization();
  return useMutation({
    mutationFn: async (data: Area) => {
      await updateArea(data, organization!.id);
    },
    onSuccess: () => {
      toast.success("Successfully updated Area.");
      queryClient.invalidateQueries({
        queryKey: ["area", { id: area._id }],
      });
      queryClient.invalidateQueries({
        queryKey: ["walkthrough", { id: selectedWalkthrough }],
      });

      if (onAreaSave) {
        onAreaSave();
      }
    },
  });
}

export function useDeleteArea(
  selectedWalkthrough: string,
  onAreaSave?: () => void
) {
  const queryClient = useQueryClient();
  const { organization } = useOrganization();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) =>
      await deleteArea(id, organization!.id),
    onSuccess: () => {
      toast.success("Successfully deleted Area.");
      queryClient.invalidateQueries({
        queryKey: ["area", { walkthrough: selectedWalkthrough }],
      });
      queryClient.invalidateQueries({
        queryKey: ["walkthrough", { id: selectedWalkthrough }],
      });

      if (onAreaSave) {
        onAreaSave();
      }
    },
    onError: (error) => {
      toast.error("Failed to delete Area. " + error);
    },
  });
}

export function useSaveNewDataPoint(selectedWalkthrough: string) {
  const { organization } = useOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: DataPoint) => {
      await createDataPoint(data, organization!.id);
    },
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
}

export function useSaveUpdatedDataPoint(selectedWalkthrough: string) {
  const { organization } = useOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: DataPoint) => {
      await updateDataPoint(data, organization!.id);
    },
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
}

export function useDeleteDataPoint(selectedWalkthrough: string) {
  const { organization } = useOrganization();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await deleteDataPoint(id, organization!.id);
    },
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
}
