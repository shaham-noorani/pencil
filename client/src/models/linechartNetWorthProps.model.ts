export default interface LinechartNetWorthProps {
    data: {
      name: string;
      value: number;
    }[];
    maxNetWorthDifference: number;
    maxNetWorth: number;
    minNetWorth: number;
  }
  