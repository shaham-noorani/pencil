export default interface LinechartBurnPageProps {
    data: {
      name: string;
      value: number;
    }[];
    maxDifference: number;
    maxValue: number;
    minValue: number;
  }
  