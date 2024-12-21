import { Area } from "@/types";
import DataPointRenderer from "./DataPointRenderer";

interface SubAreaProps {
  data: Area[];
  walkthroughId: string;
  edit: boolean;
  border?: boolean;
  formDisabled: boolean;
}

const SubArea: React.FC<SubAreaProps> = ({
  data,
  walkthroughId,
  edit,
  border,
  formDisabled,
}) => {
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
            <div
              data-to-scrollspy-id={area._id}
              id={area._id}
              className="m-4 scroll-m-32"
            >
              {area.name}
            </div>
          </div>
          {area.areas && area.areas.length > 0 && (
            <div className={`w-full ${border ? "border" : ""}`}>
              <SubArea
                data={area.areas}
                edit={edit}
                walkthroughId={walkthroughId}
                formDisabled={formDisabled}
              />
            </div>
          )}
          {area.dataPoints && area.dataPoints.length > 0 && (
            <DataPointRenderer
              data={area.dataPoints}
              draggable={edit}
              walkthroughId={walkthroughId}
              formDisabled={formDisabled}
              border
            />
          )}
        </div>
      ))}
    </>
  );
};

export default SubArea;
