import { VStack, Flex, Button, Box, Text } from "@chakra-ui/react";
import React from "react";

interface SuggestionListProps {
  hasSurplus: boolean;
}

const SuggestionList: React.FC<SuggestionListProps> = ({
  hasSurplus,
}: SuggestionListProps) => {
  return (
    <Box p={4} bg="#363636" borderRadius="md">
      <Text fontWeight="bold" fontSize={"20px"} color={"white"}>
        We Suggest:
      </Text>

      {hasSurplus ? <FunSpendingSuggestions /> : <SavingsSuggestions />}
    </Box>
  );
};

export default SuggestionList;

const FunSpendingSuggestions = () => {
  return (
    <VStack spacing={1} align="stretch" mt={2}>
      <SuggestionItem
        title={"Go to the movies"}
        description={"You've got some extra cash to spend on a movie night!"}
        link={"https://www.fandango.com/"}
      />
      <SuggestionItem
        title={"Go out to eat"}
        description={"Treat yourself to a nice meal out!"}
        link={"https://www.opentable.com/"}
      />
      <SuggestionItem
        title={"Buy a new book"}
        description={"You've got some extra cash to spend on a new book!"}
        link={"https://www.barnesandnoble.com/"}
      />
    </VStack>
  );
};

const SavingsSuggestions = () => {
  return (
    <VStack spacing={2} align="stretch" mt={2}>
      <SuggestionItem
        title={"Meal prepping"}
        description={"Save money by preparing your meals in advance!"}
        link={"https://www.mealprephaven.com/"}
      />
      <SuggestionItem
        title={"Set a budget"}
        description={
          "Track your expenses and manage your finances effectively!"
        }
        link={"https://www.mint.com/"}
      />
      <SuggestionItem
        title={"Apply for scholarships"}
        description={"Explore opportunities for financial aid for education!"}
        link={"https://www.fastweb.com/"}
      />
    </VStack>
  );
};

interface SuggestionItemProps {
  title: string;
  description: string;
  link: string;
}
const SuggestionItem = ({ title, description, link }: SuggestionItemProps) => {
  return (
    <Box px={4} py={2} borderRadius="md" shadow="sm">
      <Flex>
        <Box w={"80%"} mr={"5%"}>
          <ul>
            <li>
              <Text fontWeight="bold" fontSize="17px" color={"white"}>
                {title}
              </Text>
            </li>
          </ul>
          <Text color="#9D9D9D" fontSize="small">
            {description}
          </Text>
        </Box>
        <Button
          colorScheme="blue"
          alignSelf={"center"}
          onClick={() => window.open(link, "_blank")}
        >
          Go
        </Button>
      </Flex>
    </Box>
  );
};
