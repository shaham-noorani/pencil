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
import BankAccount from "../../models/bankAccount.model";

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
        <VStack px={1} align="stretch">
          {accounts.map((account, index) => (
            <Flex
              key={index}
              p={3}
              bg="#151515"
              borderRadius="md"
              justifyContent="space-between"
              alignItems="center"
            >
              <VStack align="flex-start" spacing={0}>
                <Text color="white">{account.bankNickname}</Text>
                <Text color="gray.400">
                  {account.bankName} (...{account.last4AccountNumber})
                </Text>
              </VStack>
              <Text color="white" fontSize="lg" fontWeight="semibold">
                ${account.balance.toLocaleString()}
              </Text>
            </Flex>
          ))}
        </VStack>
      </Collapse>
    </VStack>
  );
};

export default CashTabComponent;
