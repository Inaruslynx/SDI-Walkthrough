import React from "react";
import { Area } from "@/types";
import WalkthroughAreaCard from "./WalkthroughAreaCard";
import WalkthroughDataCard from "./WalkthroughDataCard";

interface WalkthroughRendererProps {
  selectedWalkthrough: string;
  areas: Area[];
  onAddArea: (parentAreaName?: string[]) => void;
  onAddDataPoint: (parentAreaName: string[]) => void;
}

const indentationClasses = ["ml-0", "ml-20", "ml-40", "ml-60", "ml-80"];

const WalkthroughRenderer: React.FC<WalkthroughRendererProps> = ({
  selectedWalkthrough,
  areas,
  onAddArea,
  onAddDataPoint,
}) => {
  if (selectedWalkthrough === "Select a Walkthrough") {
    return null;
  }
  console.log("areas in renderer:", areas);

  const renderAreas = (areas: Area[], indent = false): React.ReactNode => {
    return areas.map((area, index) => (
      <div className={indent ? "ml-20" : ""} key={area._id || index}>
        <WalkthroughAreaCard
          selectedWalkthrough={selectedWalkthrough}
          area={area}
          onAddArea={onAddArea}
          onAddDataPoint={onAddDataPoint}
        />
        {/* <h3>{index} after new card</h3> */}
        {area?.dataPoints?.map((dataPoint) => (
          <WalkthroughDataCard
            key={dataPoint.text}
            selectedWalkthrough={selectedWalkthrough}
            dataPoint={dataPoint}
            parentArea={area._id}
          />
        ))}
        {/* <h1>Hi</h1> */}
        {area &&
          area.areas &&
          area.areas.length > 0 &&
          renderAreas(area.areas, true)}
        {/* <h1>Hi 2</h1> */}
      </div>
    ));
  };

  return <div>{renderAreas(areas)}</div>;
};

export default WalkthroughRenderer;
