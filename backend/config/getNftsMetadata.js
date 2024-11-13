const { createUmi } = require('@metaplex-foundation/umi-bundle-defaults')
const { fetchDigitalAsset, fetchAllDigitalAssetByOwner, fetchAllDigitalAssetByVerifiedCollection } = require('@metaplex-foundation/mpl-token-metadata');
const umi = createUmi('https://api.devnet.solana.com');

// Function to fetch digital asset by mintHash
exports.getDigitalAssetByMintHash = async (mintHash) => {
    try {
        const nftMetadata = await fetchDigitalAsset(umi, mintHash);
        return nftMetadata;
    } catch (error) {
        console.error("Error fetching digital asset by mintHash:", error);
        throw error;
    }
}

// Function to fetch all digital assets by owner address
exports.getDigitalAssetsByAddress = async (address) => {
    try {
        const mintAddresses = await fetchAllDigitalAssetByOwner(umi, address);
        return mintAddresses;
    } catch (error) {
        console.error("Error fetching digital assets by owner address:", error);
        throw error;
    }
}

exports.getDigitalAssetByCollection = async (collectionMintAddress) => {
    try {
        const nfts = await fetchAllDigitalAssetByVerifiedCollection(umi, collectionMintAddress)
        console.log("nfts", nfts);

        return nfts;

    } catch (error) {
        console.error("Error fetching digital assets by owner address:", error);
        throw error;
    }
}
