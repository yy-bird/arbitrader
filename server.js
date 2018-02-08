const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const Quoinex = require("./quoinex");
const Market = require("./market");

const port = process.env.PORT || 5000;

const markets = {
    btcusd: new Market("btc", "usd", 0.001),
    btcjpy: new Market("btc", "jpy", 0.001),
    btcsgd: new Market("btc", "sgd", 0.001),
    ethusd: new Market("eth", "usd", 0.01),
    ethjpy: new Market("eth", "jpy", 0.01),
    ethsgd: new Market("eth", "sgd", 0.01),
    ethbtc: new Market("eth", "btc", 0.01),
    qashjpy: new Market("qash", "jpy", 1),
    qasheth: new Market("qash", "eth", 1),
    qashbtc: new Market("qash", "btc", 1),
    qashusd: new Market("qash", "usd", 1)
};

const quoinex = new Quoinex(markets);
quoinex.onChange(() => {
    io.emit("markets", quoinex.minOrders);
});

app.get("/api/markets", (req, res) => {
    res.send(quoinex.markets);
});

app.get("/api/minOrders", (req, res) => {
    res.send(quoinex.minOrders);
});

server.listen(port, () => console.log(`Listening on port ${port}\n${Date()}`));
