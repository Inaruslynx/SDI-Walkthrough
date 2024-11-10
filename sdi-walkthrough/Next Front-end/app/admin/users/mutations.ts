import { updateUser } from "@/lib/api";
import { User } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: User) => {
      await updateUser(user._id!, user);
    },
    onSuccess: (data, variables, context) => {
      toast.success("User(s) successfully updated");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (e) =>
      toast.error(`Failed to update user(s) because ${e.message}`),
  });
}
