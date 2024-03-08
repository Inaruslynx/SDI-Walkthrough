import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

interface GraphData {
  labels: Date[];
  datasets: [{
    data: number[];
  }];
}

// TODO Find out how to access theme colors and assign them to lines
export default function Graph(prop: { data: GraphData }) {
  const data = prop.data;
  const options = {
    responsive: true,
  };

  if (prop) {
    return <Line data={data} options={options} />;
  }
}
