import { useState } from "react";
import "./App.css";
import {
  Button,
  Box,
  Heading,
  Text,
  Checkbox,
  Slider,
  Input,
  Radio,
  Select,
} from "@chakra-ui/react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Box textAlign="center" mt={10}>
        <Heading>Button Counter</Heading>
        <Text fontSize="xl" mt={4}>
          Count: {count}
        </Text>
        <Button onClick={() => setCount((count) => count + 1)} mt={4}>
          Increment
        </Button>
        <Button onClick={() => setCount((count) => count - 1)} mt={4} ml={2}>
          Decrement
        </Button>
        <Button onClick={() => setCount(0)} mt={4} ml={2}>
          Reset
        </Button>
      </Box>
      <Box textAlign="center" mt={10}>
        <Heading>Chakra UI is working!</Heading>
        <Checkbox defaultChecked>Checkbox</Checkbox>
        <Slider aria-label="slider-ex-1" defaultValue={30} mt={4} />
        <Input placeholder="Enter text" mt={4} />
        <Radio colorScheme="blue" mt={4}>
          Radio
        </Radio>
        <Select placeholder="Select option" mt={4}>
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </Select>
      </Box>
    </>
  );
}

export default App;
