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

  return (
    <Box width="92%" margin="0 auto">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ right: 10, left: 10 }}>
          <XAxis dataKey="name" tick={{ fill: "white", fontWeight: "bold" }} />
          <YAxis domain={yAxisDomain} hide={true} />
          <Tooltip />
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
