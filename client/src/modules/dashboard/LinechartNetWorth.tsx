import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import LinechartNetWorthProps from "../../models/linechartNetWorthProps.model";
import { Box } from "@chakra-ui/react";

const LinechartNetWorth = ({
  data,
  maxNetWorthDifference,
  maxNetWorth,
  minNetWorth,
}: LinechartNetWorthProps) => {
  const lineColor =
    data[data.length - 1].value >= data[0].value ? "green" : "red";
  const yAxisDomain = [
    minNetWorth - maxNetWorthDifference * 0.1,
    maxNetWorth + maxNetWorthDifference * 0.1,
  ];

  console.log("\n\n\tNETWORTH DATA\n\n");
  console.log(data);
  console.log("\n\n\tNETWORTH DATA\n\n");

  return (
    <Box width="92%" margin="0 auto">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ right: 10, left: 10 }}>
          <XAxis
            dataKey="name"
            tickFormatter={(value) => value[0]}
            tick={{ fill: "white", fontWeight: "bold" }}
          />
          <YAxis domain={yAxisDomain} hide={true} />
          <Tooltip
            formatter={(value, name) => {
              const formattedValue =
                value as number < 0 ? `-$${Math.abs(value as number)}` : `$${value}`;
              return [formattedValue, "Net Worth"];
            }}
          />{" "}
          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default LinechartNetWorth;
