'use strict';

module.exports = (app) => {
    app.use('/api/nft', require('./api/nft'))
};
