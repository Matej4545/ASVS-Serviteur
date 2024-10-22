import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

interface IRadarChartProps {
  data: any;
}

function RadarChart(props: IRadarChartProps) {
  const { data } = props;

  return <Radar data={data} className="w-full" />;
}

export default RadarChart;
