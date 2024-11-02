"use client";
import React, { useEffect, useRef, useState, use } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ScrollArea } from "@/components/ui/scroll-area";
import WalkthroughRenderer from "./WalkthroughRenderer";
import { findArea, getWalkthrough, getWalkthroughs } from "@/lib/api";
import Modal from "./modal";
import Button from "./button";
import SelectWalkthrough from "@/components/ui/selectWalkthrough";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Walkthroughs,
  Area,
  DataPoint,
  WeeklyOptions,
  WeeklyOptionsType,
  PerSwingOptions,
  PerSwingOptionsType,
} from "@/types";
import { AxiosResponse } from "axios";
import IconPlus from "@/components/ui/icons/plus";
import { PeriodicityOptions } from "@/types";
import IconSave from "@/components/ui/icons/save";
import {
  useCreateWalkthrough,
  useDeleteWalkthrough,
  useRenameWalkthrough,
  useSavePeriodicity,
} from "./mutation";

const periodicityValues = Object.values(PeriodicityOptions);
const weeklyValues = Object.values(WeeklyOptions);
const perSwingValues = Object.values(PerSwingOptions);

function usePeriodicityState() {
  const [selectedPeriodicity, setSelectedPeriodicity] = useState("");
  const [selectedWeekly, setSelectedWeekly] = useState<WeeklyOptionsType>();
  const [selectedPerSwing, setSelectedPerSwing] =
    useState<PerSwingOptionsType>();
  return {selectedPerSwing, selectedWeekly, selectedPeriodicity, setSelectedPerSwing, setSelectedWeekly, setSelectedPeriodicity};
}

export default function WalkthroughPage(props: {
  params: Promise<{ department: string }>;
}) {
  const params = use(props.params);
  // const queryClient = useQueryClient();
  const [selectedWalkthrough, setSelectedWalkthrough] = useState(
    "Select a Walkthrough"
  );
  // const [selectedPeriodicity, setSelectedPeriodicity] = useState("");
  const {selectedPerSwing, selectedWeekly, selectedPeriodicity, setSelectedPerSwing, setSelectedWeekly, setSelectedPeriodicity} = usePeriodicityState();
  // const [selectedWeekly, setSelectedWeekly] = useState<WeeklyOptionsType>();
  // const [selectedPerSwing, setSelectedPerSwing] =
  //   useState<PerSwingOptionsType>();
  const [areas, setAreas] = useState<Area[]>([
    {
      index: 0,
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
  const periodicitySelectRef = useRef<HTMLSelectElement>(null);

  // Fetch all walkthroughs for department
  const walkthroughs = useQuery<AxiosResponse<Walkthroughs>, Error>({
    queryKey: ["walkthrough", { department: params.department }],
    queryFn: () => getWalkthroughs(params.department),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch the selected Walkthrough
  const selectedWalkthroughQuery = useQuery<Area[]>({
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
      if (response.data.periodicity) {
        setSelectedPeriodicity(response.data.periodicity);
      }
      if (response.data.weekly) {
        setSelectedWeekly(response.data.weekly);
      }
      if (response.data.perSwing) {
        setSelectedPerSwing(response.data.perSwing);
      }
      // console.log("results:", results);
      return results;
    } else {
      return [];
    }
  };

  // Recursive function to fetch areas and their sub-areas
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
    return allAreas.filter((area) => area !== null);
  };

  // Create new walkthrough
  const handleCreateNewWalkthrough = useCreateWalkthrough(
    setSelectedWalkthrough,
    setAreas
  );

  const handleRenameWalkthrough = useRenameWalkthrough(setSelectedWalkthrough);

  const handleSavePeriodicity = useSavePeriodicity();

  const handleDeleteWalkthrough = useDeleteWalkthrough(setSelectedWalkthrough);

  // Callback to add a new area
  const handleAddArea = (parentArea?: Area) => {
    // console.log("trying to Add Area");
    // if (parentAreaName) {
    //   console.log("parentAreaName", parentAreaName);
    // }
    const newArea: Area = {
      index: parentArea?.areas.length || 0,
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
      index: parentArea.dataPoints.length || 0,
      text: "New Data Point",
      type: "string",
      parentArea: parentArea._id,
      parentWalkthrough: selectedWalkthrough,
      isNew: true,
    };
    console.log("Adding new Data Point to areas:", newDataPoint);
    setAreas((prevAreas) => addDataPoint(prevAreas, newDataPoint));
  };

  function recursiveDeleteUnsavedDataPoint(
    index: number,
    parentArea: Area,
    target: string
  ): Area[] {
    const result: Area[] = parentArea.areas.map((area: Area) => {
      if (area._id === target) {
        return {
          ...area,
          dataPoints: area.dataPoints.filter(
            (dataPoint: DataPoint, dataIndex: number) => {
              return dataPoint._id || dataIndex !== index;
            }
          ),
        };
      }
      if (area.areas.length > 0) {
        return {
          ...area,
          areas: recursiveDeleteUnsavedDataPoint(index, area, target),
        };
      }
      return area;
    });
    return result;
  }

  const handleDeleteUnsavedDataPoint = (index: number, parentArea: string) => {
    console.log("in handleDeleteUnsavedDatapoint");
    console.log("index", index);
    setAreas((prevAreas) =>
      prevAreas.map((area) => {
        console.log("area:", area._id, "parentArea:", parentArea);
        if (area._id === parentArea) {
          console.log("in parentArea");
          return {
            ...area,
            dataPoints: area.dataPoints.filter((dataPoint, dataIndex) => {
              console.log("dataIndex", dataIndex);
              return dataPoint._id || dataIndex !== index;
            }),
          };
        }
        if (area.areas.length > 0) {
          console.log("in subAreas");
          return {
            ...area,
            areas: recursiveDeleteUnsavedDataPoint(index, area, parentArea),
          };
        }
        return area;
      })
    );
  };

  // Function for changing periodicity
  function onChangePeriodicity(e: React.ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === PeriodicityOptions.Weekly)
      setSelectedWeekly(WeeklyOptions.Sunday);
    else setSelectedWeekly(undefined);

    if (e.target.value === PeriodicityOptions.PerSwing)
      setSelectedPerSwing(PerSwingOptions.First);
    else setSelectedPerSwing(undefined);

    setSelectedPeriodicity(e.target.value);
  }

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
          <Button
            id="walkthrough-dialog"
            type="primary"
            className="m-2 px-4 py-2"
          >
            Create New Walkthrough
          </Button>
          <Modal
            id="walkthrough-dialog"
            type="primary"
            ref={createWalkthroughModalRef}
            targetInput={walkthroughNameRef}
            onClick={() => {
              const name = walkthroughNameRef.current?.value || "";
              const department = params.department;
              handleCreateNewWalkthrough.mutateAsync({ name, department });
            }}
            onClose={() => {
              createWalkthroughModalRef.current?.close();
            }}
          >
            Create
          </Modal>
          <SelectWalkthrough
            className="align-end m-2"
            selectedWalkthrough={selectedWalkthrough}
            walkthroughs={walkthroughs.data?.data?.walkthroughs}
            onChange={setSelectedWalkthrough}
          />
          {selectedWalkthrough &&
            selectedWalkthrough !== "Select a Walkthrough" && (
              <>
                <Button
                  id="rename-walkthrough-dialog"
                  type="primary"
                  className="m-2 px-4 py-2"
                >
                  Rename Walkthrough
                </Button>
                <Modal
                  id="rename-walkthrough-dialog"
                  type="primary"
                  ref={renameWalkthroughModalRef}
                  targetInput={walkthroughRenameRef}
                  onClick={() => {
                    const name = walkthroughRenameRef.current?.value || "";
                    const id = selectedWalkthrough;
                    handleRenameWalkthrough.mutateAsync({ id, name });
                  }}
                  onClose={() => {
                    renameWalkthroughModalRef.current?.close();
                  }}
                >
                  Rename
                </Modal>
                <select
                  ref={periodicitySelectRef}
                  name="periodicity"
                  id="periodicity"
                  className="select select-bordered align-end m-2"
                  value={selectedPeriodicity}
                  onChange={(e) => {
                    onChangePeriodicity(e);
                  }}
                >
                  <option disabled value="">
                    Select a Periodicity
                  </option>
                  {periodicityValues.map((option: string) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                {selectedPeriodicity && selectedPeriodicity === "Weekly" && (
                  <select
                    value={selectedWeekly}
                    name="weekly"
                    id="weekly"
                    className="select select-bordered align-end m-2"
                    onChange={(e) => {
                      setSelectedWeekly(e.target.value);
                    }}
                  >
                    <option disabled value="">
                      Select a Day
                    </option>
                    {weeklyValues.map((option: string) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}

                {selectedPeriodicity && selectedPeriodicity === "Per Swing" && (
                  <select
                    name="perSwing"
                    id="perSwing"
                    className="select select-bordered align-end m-2"
                    onChange={(e) => {
                      setSelectedPerSwing(e.target.value);
                    }}
                  >
                    <option disabled value="">
                      Select a Day
                    </option>
                    {perSwingValues.map((option: string) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}

                {selectedPeriodicity && selectedPeriodicity !== "" && (
                  <button
                    className="btn btn-primary m-2"
                    onClick={() => {
                      const id = selectedWalkthrough;
                      const periodicity = selectedPeriodicity || undefined;
                      const weekly = selectedWeekly || undefined;
                      const perSwing = selectedPerSwing || undefined;
                      handleSavePeriodicity.mutate({
                        id,
                        periodicity,
                        weekly,
                        perSwing,
                      });
                    }}
                  >
                    <IconSave /> Periodicity
                  </button>
                )}
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
                  const id = selectedWalkthrough;
                  handleDeleteWalkthrough.mutate({ id });
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

      {selectedWalkthrough !== "Select a Walkthrough" && (
        <ScrollArea id="scroll-area" className="border min-h-screen">
          {areas?.length > 0 && (
            <WalkthroughRenderer
              selectedWalkthrough={selectedWalkthrough}
              areas={areas}
              onAddArea={handleAddArea}
              onAddDataPoint={handleAddDataPoint}
              onDeleteUnsavedDatapoint={handleDeleteUnsavedDataPoint}
            />
          )}

          <button
            className="btn btn-primary m-4"
            onClick={() => handleAddArea()}
          >
            <IconPlus /> New Area
          </button>
        </ScrollArea>
      )}
    </div>
  );
}
