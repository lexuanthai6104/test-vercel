import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface dataInterface {
  data: {
    labels: (number | string)[];
    datasets: {
      label: string;
      data: (string | number)[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  };
  // Define other props here
}

export default function LineChart({ data }: dataInterface) {
  return (
    <div className="bg-amber-50 rounded-lg p-4 shadow-lg">
      <Line data={data}></Line>
    </div>
  );
}
