import React from "react";

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function ThemeItem({
  value,
  isActive,
  onClick,
}: {
  value: string;
  isActive?: boolean;
  onClick: () => void;
}): React.ReactNode {
  return (
    <li>
      <button
        onClick={onClick}
        className={`theme-controller btn btn-sm btn-block btn-ghost justify-start ${
          isActive ? "ACTIVECLASS" : ""
        }`}
        aria-label={value}
        data-set-theme={value}
        data-act-class="ACTIVECLASS"
      >
        {capitalizeFirstLetter(value)}
      </button>
    </li>
  );
}
