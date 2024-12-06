import SortButton from "./sortButton";
import type { SortStatus, SortCategory } from "./page";

interface SortBarProps {
  sortStatus: SortStatus;
  onSort: (category: SortCategory) => void;
  isMainChecked: boolean;
  onToggleMainCheckbox: () => void;
}

export default function SortBar({
  sortStatus,
  onSort,
  isMainChecked,
  onToggleMainCheckbox,
}: SortBarProps) {
  return (
    <div className="card w-full m-4 bg-primary text-primary-content shadow-lg m-4">
      <div className="card-body w-full">
        <div className="grid grid-cols-6 gap-x-4 justify-between items-baseline">
          <input
            type="checkbox"
            className="checkbox"
            checked={isMainChecked}
            onChange={onToggleMainCheckbox}
            name="MainCheckBox"
            id="MainCheckBox"
          />
          <SortButton
            label="First Name"
            onClick={() => onSort("firstName")}
            sortStatus={sortStatus.firstName}
          />
          <SortButton
            label="Last Name"
            onClick={() => onSort("lastName")}
            sortStatus={sortStatus.lastName}
          />
          <SortButton
            label="Department"
            onClick={() => onSort("department")}
            sortStatus={sortStatus.department}
          />
          <SortButton
            label="Assigned Walkthroughs"
            onClick={() => onSort("walkthroughs")}
            sortStatus={sortStatus.walkthroughs}
          />
          <SortButton
            label="User Level"
            onClick={() => onSort("userLevel")}
            sortStatus={sortStatus.userLevel}
          />
        </div>
      </div>
    </div>
  );
}
