const axios = require('axios');
const web3 = require('@solana/web3.js');
const { errReturned, sendResponse } = require("../../config/dto.js");
const { BADREQUEST, NOTFOUND, SUCCESS } = require("../../config/resCodes.js");
const { connection } = require("../../config/provider.js");
const { getDigitalAssetByMintHash, getDigitalAssetsByAddress } = require("../../config/getNftsMetadata.js");

/**
 * Get Nfts By Wallet
 */

exports.getNftsByWallet = async (req, res) => {
    try {
        let { isAddress } = req['params'];
        if (!isAddress) return sendResponse(res, NOTFOUND, "Please Provide Address");

        const mintAddresses = await getDigitalAssetsByAddress(new web3.PublicKey(isAddress));
        let activity = [];

        const NftsPromises = mintAddresses.map(async (asset) => {
            let faction = '';
            let price = 0;

            const largestAccounts = await connection.getTokenLargestAccounts(new web3.PublicKey(asset.metadata.mint));
            const largestAccountInfo = await connection.getParsedAccountInfo(largestAccounts.value[0].address);

            const owner = (largestAccountInfo.value.data).parsed.info.owner;
            if (!owner) return null;

            else if ((process['env']['COLLECTION_KEY'] != asset.metadata.mint.toString()) && process['env']['COLLECTION_KEY'].toString() == asset.metadata.collection.value.key.toString()) {

                const response = await axios.get(asset.metadata.uri);
                var value = response['data']['attributes'][1]['value'];
                if (value.includes("Fish")) faction = 'FISH';
                if (value.includes("Shark")) faction = 'SHARKS';
                if (value.includes("Whale")) faction = 'WHALES';
                if (value.includes("Donkey")) faction = "DONKEYS";


                let tokenId = asset.metadata.uri.match(/\/([^/]+)\.json$/)[1];
                if (tokenId) {
                    let newNFT = {
                        price: price,
                        tokenId,
                        image: response.data.image,
                        collectionAddress: asset.metadata.collection.value.key.toString(),
                        collectionName: 'MPC',
                        creator: asset.metadata.creators.value[0].address.toString(),
                        name: asset.metadata.name,
                        mintHash: asset.metadata.mint.toString(),
                        solNftOwner: owner.toString(),
                        faction,
                        activity,
                        attributes: response['data']['attributes'],
                    };

                    return newNFT
                }
                return null;
            } else return null;
        });

        const ListedNfts = await Promise.all(NftsPromises);
        const filteredListedNfts = ListedNfts.filter(nft => nft != null);
        if (filteredListedNfts.length === 0) return sendResponse(res, SUCCESS, "NO NFT FOUND", filteredListedNfts);
        return sendResponse(res, SUCCESS, "Refreshed NFT Wallet", filteredListedNfts);

    } catch (error) {
        errReturned(res, error);
    }
};