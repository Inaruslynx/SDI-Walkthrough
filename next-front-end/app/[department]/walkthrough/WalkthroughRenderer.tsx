import React from "react";
import { Area, Log } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ScrollSpy from "react-ui-scrollspy";
import SubArea from "./SubArea";
import DataPointRenderer from "./DataPointRenderer";
import { FormProvider, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { toast } from "react-toastify";
import { createLog, updateLog } from "@/lib/api";

interface WalkthroughRendererProps {
  data: Area[];
  selectedWalkthrough: string;
  loadedLog: string;
  edit: boolean;
}

const WalkthroughRenderer: React.FC<WalkthroughRendererProps> = ({
  data,
  selectedWalkthrough,
  loadedLog,
  edit,
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

  const onSubmit = async (formData: Record<string, string>) => {
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
                {area.areas && area.areas.length > 0 ? (
                  <React.Fragment key={area._id + "f"}>
                    <div className="flex flex-col container w-full m-4 items-center text-center">
                      <SubArea
                        key={area._id + "a"}
                        data={area.areas}
                        edit={edit}
                        border
                      />
                    </div>
                    {area.dataPoints && area.dataPoints.length > 0 && (
                      <DataPointRenderer
                        key={area._id + "1"}
                        data={area.dataPoints}
                        draggable={edit}
                      />
                    )}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {area.dataPoints && area.dataPoints.length > 0 && (
                      <div className="flex flex-col container w-full m-4 items-center text-center">
                        <DataPointRenderer
                          key={area._id + "1"}
                          data={area.dataPoints}
                          draggable={edit}
                        />
                      </div>
                    )}
                  </React.Fragment>
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
