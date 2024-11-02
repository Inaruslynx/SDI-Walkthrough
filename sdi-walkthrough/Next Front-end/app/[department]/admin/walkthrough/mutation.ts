import { toast } from "react-toastify";
import {
  createWalkthrough,
  deleteWalkthrough,
  updateWalkthrough,
} from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Area } from "@/types";

export function useCreateWalkthrough(
  setSelectedWalkthrough: (name: string) => void,
  setAreas: (areas: Area[]) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, department }) =>
      await createWalkthrough(name, department),
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
  return useMutation({
    mutationFn: async ({ id, name }) => await updateWalkthrough(id, name),
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
  return useMutation({
    mutationFn: async ({ id }) => await deleteWalkthrough(id),
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
  // const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, periodicity, weekly, perSwing }) =>
      await updateWalkthrough(id, undefined, periodicity, weekly, perSwing),
    onSuccess: () => {
      toast.success("Successfully changed periodicity.");
    },
    onError: () => {
      toast.error("Could not change periodicity.");
    },
  });
}
