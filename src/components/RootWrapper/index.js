import React from 'react';
import DefaultStyleVariables from '~/components/DefaultStyleVariables';
import GlobalStyles from '~/components/GlobalStyle';
import Web3Provider from '~/providers/web3';

export default function RootWrapper ({ children }) {
  return (
    <DefaultStyleVariables>
      <Web3Provider>
        <GlobalStyles>
          {children}
        </GlobalStyles>
      </Web3Provider>
    </DefaultStyleVariables>
  );
}