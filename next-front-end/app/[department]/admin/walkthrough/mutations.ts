import { toast } from "react-toastify";
import {
  createWalkthrough,
  deleteWalkthrough,
  updateWalkthrough,
} from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Area } from "@/types";
import { useOrganization } from "@clerk/nextjs";

export function useCreateWalkthrough(
  setSelectedWalkthrough: (name: string) => void,
  setAreas: (areas: Area[]) => void,
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
  setSelectedWalkthrough: (name: string) => void,
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
        false,
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
  setSelectedWalkthrough: (name: string) => void,
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
        true,
      ),
    onSuccess: () => {
      toast.success("Successfully changed periodicity.");
    },
    onError: () => {
      toast.error("Could not change periodicity.");
    },
  });
}
