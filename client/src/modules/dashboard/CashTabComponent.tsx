import { useState } from "react";
import {
  Flex,
  Text,
  VStack,
  Collapse,
  IconButton,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import BankAccount from "../../models/bankAccountBase.model";

interface CashTabComponentProps {
  accounts: BankAccount[];
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
    <VStack align="stretch" spacing={1} pb="10px">
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
            {formatCurrency(totalValue)}
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
        <VStack px={1} align="stretch">
          {accounts.map((account, index) => (
            <Flex
              key={index}
              p={3}
              bg="#1a1a1a"
              borderRadius="md"
              justifyContent="space-between"
              alignItems="center"
            >
              <VStack align="flex-start" spacing={0}>
                <Text color="white">{account.bankNickname}</Text>
                <Text color="gray.400">
                  {account.institutionName} (...{account.last4AccountNumber})
                </Text>
              </VStack>
              <Text color="white" fontSize="lg" fontWeight="semibold">
                {formatCurrency(account.balance)}
              </Text>
            </Flex>
          ))}
        </VStack>
      </Collapse>
    </VStack>
  );
};

export default CashTabComponent;

function formatCurrency(value: number) {
  // Check if the number is an integer
  const isInteger = Number.isInteger(value);

  // If it's an integer, use no decimal places; otherwise, use two.
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: isInteger ? 0 : 2,
    maximumFractionDigits: isInteger ? 0 : 2
  }).format(value);
}
