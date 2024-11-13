'use strict';

const express = require('express');
const controller = require('./nft.controller');


const router = express.Router();
router.get('/getNftsByWallet/:isAddress', controller.getNftsByWallet);

module.exports = router;