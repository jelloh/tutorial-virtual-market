/**
 * This file will do all the Node.js work required.
 * Create an Express REST API to serve the data.
 */

const app = require('express')();
const http = require('http').Server(app);
const market = require('./market');
const io = require('socket.io')(http);

const port = 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/api/market', (req, res) => {
    res.send(market.marketPositions);
});

/**
 * Socket.IO connection to call the updateMarket method
 * after every 5 seconds to update the market data
 * and emit an update on the Socket.IO endpoint
 * to update the latest data for all listeners
 */
setInterval(function () {
    market.updateMarket();
    io.sockets.emit('market', market.marketPositions[0]);
}, 5000);

http.listen(port, () => {
    console.log(`Listening on *:${port}`);
});

