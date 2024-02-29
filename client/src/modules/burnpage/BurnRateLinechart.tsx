import { Box, Center, Spinner } from "@chakra-ui/react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface LinechartBurnPageProps {
  loadingChart: boolean;
  data: {
    date: string;
    actualUserBalance: number | null;
    goalUserBalance: number | null;
    projectedUserBalance: number | null;
  }[];
  maxDifference: number;
  maxValue: number;
  minValue: number;
  projectedMayBalance: number;
  goalMayBalance: number;
}

const BurnRateLinechart = ({
  loadingChart,
  data,
  maxDifference,
  maxValue,
  minValue,
  projectedMayBalance,
  goalMayBalance,
}: LinechartBurnPageProps) => {
  const yAxisDomain = [
    minValue - maxDifference * 0.1,
    maxValue + maxDifference * 0.1,
  ];
  const projectedLineColor =
    projectedMayBalance >= goalMayBalance ? "green" : "red";
  const schoolEndDate = new Date("2024-05-01");
  const augustStartDate = new Date("2023-08-01");
  if (loadingChart) {
    return (
      <Center width="100vw" height="100vh" bg="#222222">
        <Spinner size="xl" color="white" />
      </Center>
    );
  }
  return (
    <Box width="full" height="250px">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          key={maxDifference}
          data={data}
          margin={{ right: 10, left: -50 }}
        >
          <XAxis
            domain={[augustStartDate.getTime(), schoolEndDate.getTime()]}
            // scale="time"
            // type="number"
            stroke="white"
            tick={false}
            dataKey="date"
          />
          <YAxis domain={yAxisDomain} stroke="white" tick={false} />
          <Tooltip />
          <Line
            type="linear"
            dataKey="actualUserBalance"
            stroke="yellow"
            dot={false}
          />
          <Line
            type="linear"
            dataKey="goalUserBalance"
            stroke="gray"
            dot={false}
          />
          <Line
            type="linear"
            dataKey="projectedUserBalance"
            stroke={projectedLineColor}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BurnRateLinechart;
