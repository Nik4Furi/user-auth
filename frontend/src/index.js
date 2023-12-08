import { ColorModeScript } from '@chakra-ui/react';
import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';

//---------- Store Configuration of react-redux
import { Provider as ReduxProvider } from 'react-redux'
import Store from './Store/Store';


import { ChakraProvider, theme } from '@chakra-ui/react'

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <StrictMode>
    <ReduxProvider store={Store}>
      <ChakraProvider theme={theme}>
        <ColorModeScript />
        <App />
      </ChakraProvider>
    </ReduxProvider>
  </StrictMode>
);