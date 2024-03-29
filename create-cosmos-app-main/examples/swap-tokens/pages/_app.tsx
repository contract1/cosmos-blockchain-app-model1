import '../styles/globals.css';
import '@interchain-ui/react/styles';
import type { AppProps } from 'next/app';
import { ChainProvider } from '@cosmos-kit/react';
import { aminoTypes, registry } from '../config/defaults';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { assets, chains } from 'chain-registry';
import { GasPrice } from '@cosmjs/stargate';
import { SignerOptions } from '@cosmos-kit/core';
import { wallets as leap } from '@cosmos-kit/leap';
import { wallets as keplr } from '@cosmos-kit/keplr';
import { wallets as cosmostation } from '@cosmos-kit/cosmostation';
import { Box, ThemeProvider, Toaster, useTheme, useColorModeValue } from '@interchain-ui/react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    }
  }
});

function CreateCosmosApp({ Component, pageProps }: AppProps) {
  const { themeClass } = useTheme();
  
  const signerOptions: SignerOptions = {
    signingStargate: () => {
      return {
        aminoTypes,
        registry,
      };
    },
    signingCosmwasm: (chain) => {
      switch (chain.chain_name) {
        case 'osmosis':
        case 'osmosistestnet':
          return {
            gasPrice: GasPrice.fromString('0.0025uosmo'),
          };
      }
    },
  };

  return (
    <ThemeProvider>
      <ChainProvider
        chains={chains}
        assetLists={assets}
        wallets={[...keplr, ...cosmostation, ...leap]}
        walletConnectOptions={{
          signClient: {
            projectId: 'a8510432ebb71e6948cfd6cde54b70f7',
            relayUrl: 'wss://relay.walletconnect.org',
            metadata: {
              name: 'CosmosKit Template',
              description: 'CosmosKit dapp template',
              url: 'https://docs.cosmoskit.com/',
              icons: [],
            },
          },
        }}
        signerOptions={signerOptions}
      >
        <QueryClientProvider client={queryClient}>
          <Box className={themeClass} minHeight="100dvh" backgroundColor={useColorModeValue('$white', '$background')}>
            <Component {...pageProps} />
          </Box>
        </QueryClientProvider>
      </ChainProvider>

      <Toaster position={'top-right'} closeButton={true} />
    </ThemeProvider>
  );
}

export default CreateCosmosApp;
