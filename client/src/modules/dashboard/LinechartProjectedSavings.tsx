import { Box } from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import dayjs from 'dayjs';

// Constants and calculations as previously defined
const cashBalanceAugust = 15000;
const pencilStartDate = '2023-10-01';
const cashBalancePencilStartDate = 14000;
const totalCashToday = 14500; // Assume this is imported or calculated elsewhere
const targetSavings = 20000; // Assume this is imported
const todayDate = dayjs().format('YYYY-MM-DD');
const cashBalanceOneMonthAgo = 14200;

const monthsBetweenAugAndPencilStart = dayjs(pencilStartDate).diff(dayjs('2023-08-01'), 'month', true);
const savingsRatePerMonth = (cashBalancePencilStartDate - cashBalanceAugust) / monthsBetweenAugAndPencilStart;
const monthsBetweenAugAndMay = dayjs('2024-05-01').diff(dayjs('2023-08-01'), 'month', true);
const noPencilSavings = cashBalanceAugust + (savingsRatePerMonth * monthsBetweenAugAndMay);

const projectedSavingsSlope = (totalCashToday - cashBalanceOneMonthAgo) / 1; // Simplified for a one-month period
const monthsBetweenTodayAndMay = dayjs('2024-05-01').diff(dayjs(todayDate), 'month', true);
const projectedSavings = totalCashToday + (projectedSavingsSlope * monthsBetweenTodayAndMay);

const data = [
  { date: '2023-08-01', cashBalance: cashBalanceAugust },
  { date: pencilStartDate, cashBalance: cashBalancePencilStartDate },
  { date: todayDate, cashBalance: totalCashToday },
  { date: '2024-05-01', noPencilSavings, targetSavings, projectedSavings },
];

const LinechartProjectedSavings = () => {
  return (
    <Box height="200px" bgColor="green">
      {/* <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            dataKey="date"
            stroke="#ffffff"
            type="number"
            domain={[data[0].date, data[data.length - 1].date]}
            tickFormatter={(unixTime) => dayjs(unixTime).format('MMM DD')}
          />
          <YAxis stroke="#ffffff" domain={[0, 'dataMax + 1000']} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="projectedSavings"
            stroke="skyblue"
            strokeDasharray="5 5"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="noPencilSavings"
            stroke="red"
            strokeDasharray="5 5"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="targetSavings"
            stroke="green"
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer> */}
    </Box>
  );
};

export default LinechartProjectedSavings;