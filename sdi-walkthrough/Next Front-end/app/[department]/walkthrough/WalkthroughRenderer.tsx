import React from "react";
import { Area } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import ScrollSpy from "react-ui-scrollspy";
import SubArea from "./SubArea";
import DataPointElement from "./DataPointElement";

interface WalkthroughRendererProps {
  data: Area[];
}

const WalkthroughRenderer: React.FC<WalkthroughRendererProps> = ({ data }) => {
  const queryClient = useQueryClient();
  console.log("In WalkthroughRenderer");
  console.log(data);

  return (
    <ScrollSpy activeClass="active" offsetTop={38}>
      <div className="flex flex-col items-center">
        {data.map((area, index) => (
          <React.Fragment key={index}>
            <div
              id={area._id}
              key={index}
              className="p-2 mt-4 text-center scroll-m-32 prose md:prose-lg"
            >
              <h1>{area.name}</h1>
            </div>
            <div className="flex flex-col container w-full m-4 items-center text-center">
              {area.areas && area.areas.length > 0 && (
                <SubArea data={area.areas} border />
              )}
            </div>
            {area.dataPoints && area.dataPoints.length > 0 && (
              <DataPointElement data={area.dataPoints} />
            )}
          </React.Fragment>
        ))}
      </div>
    </ScrollSpy>
  );
};

export default WalkthroughRenderer;
