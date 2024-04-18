import { Box, Center, Spinner, Text } from "@chakra-ui/react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useState } from "react";
import "./Slider.css";

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
  const [startDate, setStartDate] = useState(new Date("2023-08-01").getTime());

  const endDate = new Date("2024-05-10").getTime();

  const filteredData = data.filter((d) => {
    const date = new Date(d.date).getTime();
    return date >= startDate && date <= endDate;
  });

  const onSliderChange = (value: number | number[]) => {
    if (typeof value === "number") {
      const newStartDate = new Date("2023-08-01").getTime() + value * 86400000; // value in days
      setStartDate(newStartDate);
    }
  };
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const maxSliderDays =
    (threeDaysAgo.getTime() - new Date("2023-08-01").getTime()) / 86400000;

  const yAxisDomain = [
    minValue - maxDifference * 0.3,
    maxValue + maxDifference * 0.3,
  ];
  const projectedLineColor =
    projectedMayBalance >= goalMayBalance ? "green" : "red";
  const schoolEndDate = new Date("2024-05-10");
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
          data={filteredData}
          margin={{ right: 10, left: -50 }}
        >
          <XAxis
            domain={[startDate, endDate]}
            stroke="white"
            tick={false}
            dataKey="date"
          />
          <YAxis domain={yAxisDomain} stroke="white" tick={false} />
          <Tooltip
            itemStyle={{ color: "black" }}
            formatter={(value, name) => {
              const nameMap: { [key: string]: string } = {
                actualUserBalance: "Balance",
                goalUserBalance: "Goal Balance",
                projectedUserBalance: "Projected Balance",
              };
              const formattedValue =
                (value as number) < 0
                  ? `-$${Math.abs(value as number).toFixed(2)}`
                  : `$${Number(value).toFixed(2)}`;
              return [
                formattedValue,
                nameMap[name as keyof typeof nameMap] || name,
              ];
            }}
          />{" "}
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
      <Slider
        min={0}
        max={maxSliderDays}
        defaultValue={0}
        onChange={onSliderChange}
      />
      <Text color={"white"} textAlign={"center"}>
        Zoom
      </Text>
    </Box>
  );
};

export default BurnRateLinechart;
