const web3 = require('@solana/web3.js');

let connectionRpc = 'https://api.devnet.solana.com'
let connection = new web3.Connection(connectionRpc);

module.exports = { connection };