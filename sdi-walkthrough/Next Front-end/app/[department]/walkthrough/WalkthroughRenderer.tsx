import React from "react";
import { Area, Log } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ScrollSpy from "react-ui-scrollspy";
import SubArea from "./SubArea";
import DataPointElement from "./DataPointElement";
import { FormProvider, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { toast } from "react-toastify";
import { createLog, updateLog } from "@/lib/api";

interface WalkthroughRendererProps {
  data: Area[];
  selectedWalkthrough: string;
  loadedLog: string;
}

const WalkthroughRenderer: React.FC<WalkthroughRendererProps> = ({
  data,
  selectedWalkthrough,
  loadedLog,
}: WalkthroughRendererProps) => {
  const queryClient = useQueryClient();
  const methods = useForm();
  // console.log("In WalkthroughRenderer");
  // console.log(data);

  // Log CRUD
  const createLogMutation = useMutation({
    mutationFn: createLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["log"] });
      toast.success("Successfully entered Log.");
    },
    onError: (e) => {
      toast.error(`Failed to enter Log. ${e}`);
    },
  });

  const updateLogMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Log }) =>
      updateLog(id, data),
    onSuccess: () => {
      toast.success("Successfully updated Log.");
    },
    onError: (e) => {
      toast.error(`Failed to update Log. ${e}`);
    },
  });

  const onSubmit = async (
    formData: Record<string, string | number | boolean>,
  ) => {
    // Map formData to the expected structure for Log.data
    const mappedData = Object.entries(formData).map(([dataPoint, value]) => ({
      dataPoint,
      value,
    }));

    const logPackage: Log = {
      walkthrough: selectedWalkthrough,
      data: mappedData,
    };

    try {
      if (!loadedLog) {
        await createLogMutation.mutateAsync(logPackage);
      } else {
        await updateLogMutation.mutateAsync({
          id: loadedLog,
          data: logPackage,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ScrollSpy activeClass="active" offsetTop={38} useBoxMethod={false}>
      <FormProvider {...methods}>
        <div className="flex flex-col items-center">
          <DevTool control={methods.control} />
          <form
            className="flex flex-col container items-center"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            {data.map((area, index) => (
              <React.Fragment key={index}>
                <div
                  id={area._id}
                  key={index}
                  className="p-2 mt-4 text-center scroll-m-32 prose md:prose-lg"
                >
                  <h1 data-to-scrollspy-id={area._id}>{area.name}</h1>
                </div>
                <div className="flex flex-col container w-full m-4 items-center text-center">
                  {area.areas && area.areas.length > 0 && (
                    <SubArea key={area._id} data={area.areas} border />
                  )}
                </div>
                {area.dataPoints && area.dataPoints.length > 0 && (
                  <DataPointElement key={area._id} data={area.dataPoints} />
                )}
              </React.Fragment>
            ))}
            <div className="flex flex-col m-4 items-center">
              <input
                className="btn btn-primary"
                type="submit"
                value={loadedLog ? `Update` : "Submit"}
              />
            </div>
          </form>
        </div>
      </FormProvider>
    </ScrollSpy>
  );
};

export default WalkthroughRenderer;
