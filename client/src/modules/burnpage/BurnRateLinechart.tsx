import { Box } from "@chakra-ui/react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface LinechartBurnPageProps {
  data: {
    name: string;
    value: number;
  }[];
  maxDifference: number;
  maxValue: number;
  minValue: number;
  projectedMayData: {
    name: string;
    value: number;
  };
  goalMayData: {
    name: string;
    value: number;
  };
}

const BurnRateLinechart = ({
  data,
  maxDifference,
  maxValue,
  minValue,
  projectedMayData,
  goalMayData,
}: LinechartBurnPageProps) => {
  const yAxisDomain = [
    minValue - maxDifference * 0.1,
    maxValue + maxDifference * 0.1,
  ];
  const todayToProjectedMayData = [data[data.length - 1], projectedMayData];
  const todayToGoalMayData = [data[data.length - 1], goalMayData];
  const projectedLineColor =
    projectedMayData.value >= goalMayData.value ? "green" : "red";
  const schoolEndDate = new Date("2024-05-01");
  const augustStartDate = new Date("2023-08-01");

  return (
    <Box width="full" height="250px">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart width={600} height={300} margin={{ right: 10, left: -50 }}>
          <XAxis
            domain={[
              augustStartDate.toLocaleDateString(),
              schoolEndDate.toLocaleDateString(),
            ]}
            stroke="white"
            tick={false}
            dataKey="name"
          />
          <YAxis domain={yAxisDomain} stroke="white" tick={false} />
          <Tooltip />
          <Line type="monotone" data={data} dataKey="value" stroke="#FFD700" dot={false}/>
          <Line type="monotone" data={todayToGoalMayData} dataKey="value" stroke="#808080" dot={false}/>
          <Line type="monotone" data={todayToProjectedMayData} dataKey="value" stroke={projectedLineColor} dot={false}/>
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BurnRateLinechart;