import { useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  Collapse,
  IconButton,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

interface Account {
  bankName: string;
  last4CCNumber: string;
  bankNickname: string;
  value: number;
}
interface CashTabComponentProps {
  accounts: Account[];
  label: string;
  totalValue: number;
}

const CashTabComponent = ({
  accounts,
  label,
  totalValue,
}: CashTabComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <VStack align="stretch" spacing={4} pb="10px">
      <Flex
        justifyContent="space-between"
        p={4}
        bg="#151515"
        borderRadius="md"
        alignItems="center"
      >
        <Text fontWeight="bold" color="white">
          {label}
        </Text>
        <Flex align="center">
          <Text color="white" mr={2}>
            ${totalValue.toLocaleString()}
          </Text>
          <IconButton
            icon={
              isOpen ? (
                <ChevronUpIcon color="white" />
              ) : (
                <ChevronDownIcon color="white" />
              )
            }
            aria-label={isOpen ? "Collapse" : "Expand"}
            onClick={handleToggle}
            variant="ghost"
            _focus={{ boxShadow: "none" }}
          />
        </Flex>
      </Flex>
      <Collapse in={isOpen}>
        <VStack p={4} spacing={4} align="stretch">
          {accounts.map((account, index) => (
            <Box key={index} p={3} bg="gray.600" borderRadius="md">
              <Text color="white">
                {account.bankNickname} - ${account.value.toLocaleString()}
              </Text>
              <Text color="gray.400">
                {account.bankName} (...{account.last4CCNumber})
              </Text>
            </Box>
          ))}
        </VStack>
      </Collapse>
    </VStack>
  );
};

export default CashTabComponent;
