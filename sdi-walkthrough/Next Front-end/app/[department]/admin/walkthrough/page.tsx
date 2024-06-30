"use client";
import React, { useEffect, useRef, useState } from "react";
// import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ScrollArea } from "@/components/ui/scroll-area";
// import WalkthroughAreaCard from "./WalkthroughAreaCard";
import WalkthroughRenderer from "./WalkthroughRenderer";
import {
  createWalkthrough,
  deleteWalkthrough,
  findArea,
  getWalkthrough,
  getWalkthroughs,
  updateWalkthrough,
} from "@/lib/api";
import Modal from "./modal";
import Button from "./button";
import SelectWalkthrough from "@/components/ui/selectWalkthrough";
import {
  useMutation,
  useQuery,
  useQueries,
  useQueryClient,
} from "@tanstack/react-query";
import { Walkthrough, Walkthroughs, Area, DataPoint } from "@/types";
import { AxiosResponse } from "axios";
import IconPlus from "@/components/ui/icons/plus";

export default function WalkthroughPage({
  params,
}: {
  params: { department: string };
}) {
  const queryClient = useQueryClient();
  const [selectedWalkthrough, setSelectedWalkthrough] = useState(
    "Select a Walkthrough"
  );
  const [areas, setAreas] = useState<Area[]>([
    {
      name: "",
      parentType: "walkthrough",
      parentWalkthrough: "",
      areas: [],
      dataPoints: [],
    },
  ]);
  const walkthroughNameRef = useRef<HTMLInputElement>(null);
  const walkthroughRenameRef = useRef<HTMLInputElement>(null);
  const createWalkthroughModalRef = useRef<HTMLDialogElement>(null);
  const deleteWalkthroughModalRef = useRef<HTMLDialogElement>(null);
  const renameWalkthroughModalRef = useRef<HTMLDialogElement>(null);

  // Fetch all walkthroughs for department
  const walkthroughs = useQuery<AxiosResponse<Walkthroughs>, Error>({
    queryKey: ["walkthrough", { department: params.department }],
    queryFn: () => getWalkthroughs(params.department),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch the selected Walkthrough
  const selectedWalkthroughQuery = useQuery<AxiosResponse<Walkthrough>, Error>({
    queryKey: ["walkthrough", { id: selectedWalkthrough }],
    queryFn: () => masterGetWalkthrough(selectedWalkthrough),
    staleTime: 1000 * 60 * 5,
    enabled:
      selectedWalkthrough !== "" &&
      selectedWalkthrough !== "Select a Walkthrough",
  });

  const masterGetWalkthrough = async (
    walkthroughId: string
  ): Promise<Area[]> => {
    const response = await getWalkthrough(walkthroughId);
    // console.log("response:", response.data.data);
    if (response) {
      const results = await fetchWalkthroughAreas(response.data.data);
      // console.log("results:", results);
      return results;
    } else {
      return [];
    }
  };

  const fetchWalkthroughAreas = async (areas: Area[]): Promise<Area[]> => {
    const allAreas: Area[] = await Promise.all(
      areas.map(async (area: Area) => {
        if (!area._id) return null;
        const response = await findArea(area._id);
        const areaData = response.data;
  
        if (areaData.areas && areaData.areas.length > 0) {
          const subAreas = await fetchWalkthroughAreas(areaData.areas);
          areaData.areas = subAreas;
        }
  
        return areaData;
      })
    );
  
    // Filter out any null values
    return allAreas.filter(area => area !== null);
  };

  // Recursive function to fetch areas and their sub-areas
  const fetchArea = async (areaId: string) => {
    const response = await findArea(areaId);
    const area = response.data;

    if (area.areas && area.areas.length > 0) {
      const subAreas = await Promise.all(
        area.areas
          .filter((subArea) => subArea._id)
          .map((subArea) => fetchArea(subArea._id))
      );
      area.areas = subAreas;
    }

    return area;
  };

  // Create new walkthrough
  const handleCreateNewWalkthrough = useMutation({
    mutationFn: async () => {
      const name = walkthroughNameRef.current?.value || "";

      return createWalkthrough(name, params.department);
    },
    onSuccess: (data) => {
      toast.success("Successfully created new walkthrough.");
      queryClient.invalidateQueries({ queryKey: ["walkthrough"] });
      setSelectedWalkthrough(data.data.name);
      // setAreas([{ name: "", areas: [], dataPoints: [] }]);
    },
    onError: () => {
      toast.error("Failed to create walkthrough.");
    },
  });

  const handleRenameWalkthrough = useMutation({
    mutationFn: () => {
      if (!walkthroughRenameRef.current) throw new Error();
      const name = walkthroughRenameRef.current.value;
      const id = selectedWalkthrough;
      return updateWalkthrough(id, name);
    },
    onSuccess: () => {
      toast.success("Successfully renamed walkthrough.");
      queryClient.invalidateQueries({ queryKey: ["walkthrough"] });
      setSelectedWalkthrough;
    },
  });

  const handleDeleteWalkthrough = useMutation({
    mutationFn: () => {
      return deleteWalkthrough(selectedWalkthrough);
    },
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

  // Callback to add a new area
  const handleAddArea = (parentArea?: Area) => {
    // console.log("trying to Add Area");
    // if (parentAreaName) {
    //   console.log("parentAreaName", parentAreaName);
    // }
    const newArea: Area = {
      name: `New Area ${areas.length + 1}`,
      parentType: "walkthrough",
      parentWalkthrough: selectedWalkthrough,
      areas: [],
      dataPoints: [],
      isNew: true,
    };
    if (parentArea) {
      // console.log("In parentArea:", parentArea);
      newArea.parentArea = parentArea._id;
      newArea.parentType = "area";
      // console.log(newArea);
      const currentAreas = areas;
      const newAreas = addArea(currentAreas, newArea);
      // console.log("newAreas:", newAreas);
      setAreas(newAreas);
    } else {
      // console.log("adding new area");
      setAreas((prevAreas) => [...prevAreas, newArea]);
    }
  };

  function addArea(prevArea: Area[], newArea: Area): Area[] {
    const result: Area[] = prevArea.map((area) => {
      if (area._id === newArea.parentArea) {
        // console.log("Found area newArea belongs in");
        return { ...area, areas: [...area.areas, newArea] };
      }
      if (area.areas.length > 0) {
        // console.log("entered subAreas");
        return { ...area, areas: addArea(area.areas, newArea) };
      }
      return area;
    });
    // console.log("returning:", result);
    return result;
  }

  // Function to add a new dataPoint to it's parentArea
  function addDataPoint(prevAreas: Area[], newDataPoint: DataPoint): Area[] {
    console.log("New Data Point:", newDataPoint);
    const result: Area[] = prevAreas.map((area) => {
      console.log("Area:", area);
      if (area._id === newDataPoint.parentArea) {
        console.log("Found area newDataPoint belongs in");
        return { ...area, dataPoints: [...area.dataPoints, newDataPoint] };
      }
      if (area.areas && area.areas.length > 0) {
        return { ...area, areas: addDataPoint(area.areas, newDataPoint) };
      }
      return area;
    });

    return result;
  }

  // Callback to add a new data point
  const handleAddDataPoint = (parentArea: Area) => {
    if (!parentArea || !parentArea._id) return;
    console.log("Adding new Data Point!");
    const newDataPoint: DataPoint = {
      text: "New Data Point",
      type: "string",
      parentArea: parentArea._id,
      parentWalkthrough: selectedWalkthrough,
      isNew: true,
    };
    console.log("Adding new Data Point to areas:", newDataPoint);
    setAreas((prevAreas) => addDataPoint(prevAreas, newDataPoint));
  };

  // is this necessary?
  useEffect(() => {
    if (
      selectedWalkthrough !== "" &&
      selectedWalkthrough !== "Select a Walkthrough"
    ) {
      selectedWalkthroughQuery.refetch();
    }
  }, [selectedWalkthrough]);

  useEffect(() => {
    if (selectedWalkthroughQuery.isSuccess && selectedWalkthroughQuery.data) {
      console.log("selectedWalkthrough", selectedWalkthroughQuery?.data);
      setAreas(selectedWalkthroughQuery.data);
    }
  }, [selectedWalkthroughQuery.isSuccess, selectedWalkthroughQuery.data]);

  // useEffect(() => {
  //   console.log("areas:", areas);
  // }, [areas]);

  return (
    <div className="px-8 pb-4">
      <div className="mb-4 relative justify-center prose md:prose-lg max-w-full container">
        <h1 className="text-center">Admin - {params.department} Walkthrough</h1>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <Button id="walkthrough-dialog" type="primary">
            Create New Walkthrough
          </Button>
          <Modal
            id="walkthrough-dialog"
            type="primary"
            ref={createWalkthroughModalRef}
            targetInput={walkthroughNameRef}
            onClick={() => {
              handleCreateNewWalkthrough.mutate();
            }}
            onClose={() => {
              createWalkthroughModalRef.current?.close();
            }}
          >
            Create
          </Modal>
          <SelectWalkthrough
            className="align-end"
            selectedWalkthrough={selectedWalkthrough}
            walkthroughs={walkthroughs.data?.data?.walkthroughs}
            onChange={setSelectedWalkthrough}
          />
          {selectedWalkthrough &&
            selectedWalkthrough !== "Select a Walkthrough" && (
              <>
                <Button id="rename-walkthrough-dialog" type="primary">
                  Rename Walkthrough
                </Button>
                <Modal
                  id="rename-walkthrough-dialog"
                  type="primary"
                  ref={renameWalkthroughModalRef}
                  targetInput={walkthroughRenameRef}
                  onClick={() => {
                    handleRenameWalkthrough.mutate();
                  }}
                  onClose={() => {
                    renameWalkthroughModalRef.current?.close();
                  }}
                >
                  Rename
                </Modal>
              </>
            )}
        </div>

        {selectedWalkthrough &&
          selectedWalkthrough !== "Select a Walkthrough" && (
            <div className="justify-end">
              <Button id="delete-walkthrough-dialog" type="error">
                Delete Walkthrough
              </Button>
              <Modal
                id="delete-walkthrough-dialog"
                type="error"
                ref={deleteWalkthroughModalRef}
                onClick={() => {
                  handleDeleteWalkthrough.mutate();
                }}
                onClose={() => {
                  deleteWalkthroughModalRef.current?.close();
                }}
              >
                Delete
              </Modal>
            </div>
          )}
      </div>

      <ScrollArea id="scroll-area" className="border min-h-screen">
        {areas && (
          <WalkthroughRenderer
            selectedWalkthrough={selectedWalkthrough}
            areas={areas}
            onAddArea={handleAddArea}
            onAddDataPoint={handleAddDataPoint}
          />
        )}

        {selectedWalkthrough !== "Select a Walkthrough" && (
          <button
            className="btn btn-primary m-4"
            onClick={() => handleAddArea()}
          >
            <IconPlus /> New Area
          </button>
        )}
      </ScrollArea>
    </div>
  );
}
