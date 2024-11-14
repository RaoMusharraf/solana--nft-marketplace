const Swap = require(`./development/swap.json`);
const marketplace = require(`./development/marketplace.json`);


const SwapABI = Swap['abi'];
const SwapAddress = Swap['address'];


const marketplaceABI = marketplace['abi'];
const marketplaceAddress = marketplace['address'];

module.exports = { SwapABI, SwapAddress, marketplaceABI, marketplaceAddress };
