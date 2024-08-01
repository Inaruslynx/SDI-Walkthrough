import { Area } from "@/types";
import DataPointElement from "./DataPointElement";

interface SubAreaProps {
  data: Area[];
  border?: boolean;
}

const SubArea: React.FC<SubAreaProps> = ({ data, border }) => {
  return (
    <>
      {data.map((area, index) => (
        <div
          key={index}
          className={`p-2 min-w-full items-center text-center prose md:prose-lg`}
        >
          <div
            className={`text-2xl font-bold m-4 ${!border ? "underline" : ""}`}
          >
            <div id={area._id} className="m-4 scroll-m-32">
              {area.name}
            </div>
          </div>
          {area.areas && area.areas.length > 0 && (
            <div className={`w-full ${border ? "border" : ""}`}>
              <SubArea data={area.areas} />
            </div>
          )}
          {area.dataPoints && area.dataPoints.length > 0 && (
            <DataPointElement data={area.dataPoints} />
          )}
        </div>
      ))}
    </>
  );
};

export default SubArea;
