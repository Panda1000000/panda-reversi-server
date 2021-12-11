const Message = require("./Message");
const WebSocketClient = require("./WebSocketClient");
const WebSocketServer = require("./WebSocketServer");

let roomId = "";
// const server = new WebSocketServer(8080, "localhost");
// const server = new WebSocketServer(process.env.PORT, "https://panda-reversi-server.herokuapp.com/")
const server = new WebSocketServer(process.env.PORT)
/**
 * @param {WebSocketClient} ws 
 */
const connected = (ws) => {
    if( server.getClients().length%2 === 1 ) {
        roomId = ws.getId();
        ws.send({type: "waiting", value: "waiting for opponent..."})
    }else {
        const clients = server.searchClients("room", roomId);
        for (let i = 0; i < clients.length; i++) {
            if(i == 0) {
                clients[i].send({ type: "matching", value: "BLACK" });
            }
        }
        ws.send({ type: "matching", value: "WHITE" });
    }
    ws.attr["room"] = roomId;
    console.log("Connect!\t" + ws.getId());
}
/**
 * @param {WebSocketClient} ws 
 * @param {Message.MessageObject} message 
 */
const receve = (ws, message) => {
    if ( message.type === "put" ) {
        server.searchClients("room", ws.attr["room"]).forEach((wsc) => {
            wsc.send({type: "put", value: message.value});
        });
    }
}
/**
 * @param {WebSocketClient} ws 
 */
const close = (ws) => {
    server.searchClients("room", ws.attr["room"]).forEach((wsc) => {
        wsc.send({type: "end", value: "対戦相手との通信が切れました。"});
    });
    console.log("ばいばい");
}

server.start(connected, receve, close);
