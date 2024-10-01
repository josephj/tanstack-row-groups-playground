import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Table from './Table';

function App() {
  return (
    <ChakraProvider>
      <Table />
    </ChakraProvider>
  );
}

export default App;
