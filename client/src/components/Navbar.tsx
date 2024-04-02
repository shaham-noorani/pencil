import { Box, Flex, IconButton } from "@chakra-ui/react";
import { BiBeer } from "react-icons/bi";
import { FiHome, FiTrendingUp } from "react-icons/fi";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <Box position="fixed" bottom={0} left={0} right={0} bg="#1c1c1c" p={4}>
      <Flex justifyContent="center" gap={6}>
        <Link to="/dashboard">
          <IconButton
            aria-label="Home"
            icon={<FiHome />}
            colorScheme="white"
            size="lg"
          />
        </Link>
        <Link to="/burn">
          <IconButton
            aria-label="Burn"
            icon={<FiTrendingUp />}
            colorScheme="white"
            size="lg"
          />
        </Link>
        <Link to="/fun-budget">
          <IconButton
            aria-label="Fun Budget"
            icon={<BiBeer />}
            colorScheme="white"
            size="lg"
          />
        </Link>
      </Flex>
    </Box>
  );
};

export default Navbar;
