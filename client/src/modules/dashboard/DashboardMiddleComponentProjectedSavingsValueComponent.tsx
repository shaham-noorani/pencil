import { Box, Text } from "@chakra-ui/react";

interface ProjectedSavingsValueProps {
  projectedSavings: number;
}

const DashboardMiddleComponentProjectedSavingsValueComponent = ({
  projectedSavings,
}: ProjectedSavingsValueProps) => {
  return (
    <Box pl={4} pr={4} pb={4}>
      <Text color="white" fontSize="2xl" fontWeight="bold">
        $
        {projectedSavings.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Text>
    </Box>
  );
};

export default DashboardMiddleComponentProjectedSavingsValueComponent;
