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
  Title,
  Tooltip
);

interface GraphData {
  labels: Date[];
  datasets: [
    {
      data: number[];
    },
  ];
}

export default function Graph( data?: GraphData) {
  const options = {
    responsive: true,
  };

    if (data) {
        return <Line data={data} options={options} />;
    }
}
