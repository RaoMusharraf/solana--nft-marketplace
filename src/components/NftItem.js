import React from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';

const NftItem = ({ nft }) => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const buyNft = async () => {
        if (!publicKey) {
            alert('Connect your wallet to buy this NFT.');
            return;
        }

        const transaction = new Transaction();
        // Add your transaction instructions here
        // transaction.add(your_instruction_here);

        try {
            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'confirmed');
            alert('NFT purchased successfully!');
        } catch (error) {
            console.error('Error purchasing NFT:', error);
        }
    };

    return (
        <>
            <div className="nft-item" key={nft.id}>
                <h3>{nft.name}</h3>
                <p>Symbol: {nft.collectionName}</p>
                <img src={nft.image} alt={nft.name} className="nft-image" />
                <button onClick={() => buyNft(nft)}>Buy</button>
            </div>
        </>
    );
};

export default NftItem;
