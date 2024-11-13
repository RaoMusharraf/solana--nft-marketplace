import React from 'react';
import 'react-refresh/runtime';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import NftList from './components/NftList';

import '@solana/wallet-adapter-react-ui/styles.css';

function App() {
  const network = clusterApiUrl('devnet'); // Use 'mainnet-beta' for mainnet
  const wallets = [new PhantomWalletAdapter()];

  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="App">
            <h1>Solana NFT Market</h1>
            <WalletMultiButton />
            <NftList />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
