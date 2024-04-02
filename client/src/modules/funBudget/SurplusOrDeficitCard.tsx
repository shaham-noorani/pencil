import { Flex, Box, Text } from "@chakra-ui/react";
import React from "react";

interface SurplusOrDeficitCardProps {
  hasSurplus: boolean;
  funBudget?: number;
  overspent?: number;
}

const SurplusOrDeficitCard: React.FC<SurplusOrDeficitCardProps> = ({
  hasSurplus,
  funBudget,
  overspent,
}) => {
  return (
    <Box bgColor="#363636" borderRadius="md" p={4} mt={2}>
      {hasSurplus ? (
        <SurplusCard funBudget={funBudget!} />
      ) : (
        <DeficitCard overspent={overspent!} />
      )}
    </Box>
  );
};

export default SurplusOrDeficitCard;

const SurplusCard = ({ funBudget }: { funBudget: number }) => {
  return (
    <>
      <Flex direction={"row"} gap={"1rem"}>
        <Text mt={2} alignSelf={"center"} fontSize={"30px"}>
          🎉
        </Text>
        <Text mt={2}>
          Woohoo! You can spend a total of this much on something new this
          month!
        </Text>
      </Flex>
      <Text fontSize="36px" fontWeight="medium" mt={2}>
        ${funBudget}
      </Text>
    </>
  );
};

const DeficitCard = ({ overspent }: { overspent: number }) => {
  return (
    <>
      <Flex direction={"row"} gap={"1rem"}>
        <Text mt={2} alignSelf={"center"} fontSize={"30px"}>
          😳
        </Text>
        <Text mt={2}>
          Unfortunately, you missed your budget target by this much this month
        </Text>
      </Flex>
      <Text fontSize="36px" fontWeight="medium" mt={2}>
        ${overspent}
      </Text>
    </>
  );
};
