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
        <div key={area._id + "n"}>
          <NavLink
            scrollSpy
            id={area._id}
            href={`#${area._id}`}
            className="block text-ellipsis overflow-hidden whitespace-nowrap"
          >
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
    <ul className="mt-8 flex-col flex-nowrap items-start menu sticky top-32 max-h-[80vh] hover:overflow-y-auto">
      {Data.map((area) => renderArea(area))}
    </ul>
  );
}
