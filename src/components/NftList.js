import React, { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import NftItem from './NftItem';
import { getnft } from "../utils/get.nft";

const NftList = () => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [nfts, setNfts] = useState([]);

    useEffect(() => {
        if (!publicKey) return;

        const fetchNFTs = async () => {
            try {
                let nft = await getnft(publicKey)
                setNfts(nft);
            } catch (error) {
                console.error('Error fetching NFTs:', error);
            }
        };

        fetchNFTs();
    }, [publicKey, connection]);

    return (
        <>
            <h2>Your NFTs</h2>
            <div className="nft-container">
                {nfts.length === 0 ? (
                    <p>No NFTs found.</p>
                ) : (
                    nfts.map((nft) => (
                        <NftItem key={nft.mintHash} nft={nft} />
                    ))
                )}
            </div>
        </>
    );
};

export default NftList;
