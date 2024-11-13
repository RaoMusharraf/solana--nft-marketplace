const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();


app.use(express.json());
app.use(cors());

require('./routes')(app);

let server = require('http').createServer(app);
server.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});
