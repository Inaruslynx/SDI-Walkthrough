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
    <>
      <li>
        <div data-to-scrollspy-id={area._id}>
          <NavLink href={`#${area._id}`}>{area.name}</NavLink>
        </div>
        {area.areas && area.areas.length > 0 && (
          <ul className="ml-4">
            {area.areas.map((subArea) => renderArea(subArea))}
          </ul>
        )}
      </li>
    </>
  );

  return (
    <ul className="mt-8 flex flex-col items-center menu sticky top-32">
      {Data.map((area) => renderArea(area))}
    </ul>
  );
}
