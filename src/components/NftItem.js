import React from 'react';
import { web3, BN } from '@project-serum/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { mkt_program, provider } from '../store/provider'
import { Transaction, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { marketplaceAddress } from "../store/contract/index";

const MPL_TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
const SYSVAR_INSTRUCTIONS_PUBKEY = new PublicKey("Sysvar1nstructions1111111111111111111111111");
const AUTH_RULE_PROGRAM = new PublicKey("auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg")
const METADATA_PREFIX = "metadata";
const EDITION_SUFFIX = "edition";

const NftItem = ({ nft }) => {

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const buyNft = async () => {
        if (!publicKey) return alert('Connect your wallet to buy this NFT.')

        // variables
        const amount = new BN(1_000);
        const expireInSec = new BN(60 * 60 * 24);
        const currency = null;
        const privateTaker = null;
        const makerBroker = null;
        const authorizationData = null;
        const mintHash = new PublicKey(nft.mintHash);
        const marketplaceProgram = new PublicKey(marketplaceAddress);


        //Accounts
        let ownerATA = await getAssociatedTokenAddress(mintHash, publicKey);
        let [listStateAccount] = PublicKey.findProgramAddressSync([Buffer.from('list_state'), mintHash.toBuffer()], marketplaceProgram);
        let [listStateATA] = PublicKey.findProgramAddressSync([listStateAccount.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintHash.toBuffer()], ASSOCIATED_TOKEN_PROGRAM_ID);
        let [metadataPDA] = PublicKey.findProgramAddressSync([Buffer.from(METADATA_PREFIX), MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(), mintHash.toBuffer()], MPL_TOKEN_METADATA_PROGRAM_ID);
        let [editionPDA] = PublicKey.findProgramAddressSync([Buffer.from(METADATA_PREFIX), MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(), mintHash.toBuffer(), Buffer.from(EDITION_SUFFIX)], MPL_TOKEN_METADATA_PROGRAM_ID);


        const transaction = new Transaction();
        // Create the instruction
        const instruction = await mkt_program.methods
            .listLegacy(amount, expireInSec, currency, privateTaker, makerBroker, authorizationData)
            .accounts({
                owner: provider.wallet.publicKey,
                ownerTa: ownerATA,
                listState: listStateAccount,
                listTa: listStateATA,
                mint: mintHash,
                payer: provider.wallet.publicKey,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: web3.SystemProgram.programId,
                marketplaceProgram,
                metadata: metadataPDA,
                edition: editionPDA,
                ownerTokenRecord: null,
                listTokenRecord: null,
                authorizationRules: null,
                authorizationRulesProgram: AUTH_RULE_PROGRAM,
                tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
                sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
                cosigner: provider.wallet.publicKey,
            })
            .instruction();
        transaction.add(instruction);
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
                <button onClick={() => buyNft(nft)}>List</button>
            </div>
        </>
    );
};

export default NftItem;
