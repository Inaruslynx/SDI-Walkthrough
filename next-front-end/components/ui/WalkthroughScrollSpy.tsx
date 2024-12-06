import React from "react";
import { Area } from "@/types";
import NavLink from "../nav-bar/nav-link";

interface WalkthroughScrollSpyProps {
  Data: Area[];
}

export default function WalkthroughScrollSpy({
  Data,
}: WalkthroughScrollSpyProps) {
  const renderArea = (area: Area) => (
    <React.Fragment key={area._id + "li"}>
      <li>
        <div key={area._id + "n"} className="">
          <NavLink scrollSpy id={area._id} href={`#${area._id}`}>
            {area.name}
          </NavLink>
        </div>
        {area.areas && area.areas.length > 0 && (
          <ul key={area._id + "s"} className="ml-4">
            {area.areas.map((subArea) => renderArea(subArea))}
          </ul>
        )}
      </li>
    </React.Fragment>
  );

  return (
    <ul className="mt-8 flex flex-col items-center menu sticky top-32">
      {Data.map((area) => renderArea(area))}
    </ul>
  );
}
