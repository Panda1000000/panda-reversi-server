const Message = require("./Message");
const WebSocketClient = require("./WebSocketClient");
const WebSocketServer = require("./WebSocketServer");
const http = require("http");
const fs   = require("fs");

const mimeType = {
    'html': 'text/html',
    'js': 'text/javascript',
    'css': 'text/css',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpg',
    'gif': 'image/gif',
    "ico": "image/vnd.microsoft.icon",
    'svg': 'image/svg+xml',
    'wav': 'audio/wav',
    'mp4': 'video/mp4',
    'woff': 'application/font-woff',
    'ttf': 'application/font-ttf',
    'eot': 'application/vnd.ms-fontobject',
    'otf': 'application/font-otf',
    'wasm': 'application/wasm'
};

const httpServer = http.createServer((request, response) => {
    const root = "./client";
    const reqFilePath = (( b ) => {
        if( b ) { return root+"/index.html"; }
        else    { return root+request.url; }
    })( "."+request.url === "./" );

    const extension = reqFilePath.split(".").pop();
    const contentType = mimeType[extension] || "application/octet-stream";
    console.log(`file: ${reqFilePath}, ext: ${extension}, type: ${contentType}`)

    fs.readFile(reqFilePath, (e, content) => {
        if(e) {
            if( e.code === "ENOENT" ) {
                response.writeHead(404, {'Content-Type': 'text/html'});
                response.end("<h1>Not Found Pages</h1>");
            }else {
                response.writeHead(500);
                response.end(`Occurred error, Error-Code = ${e.code}\n`);
            }

        }else {
            response.writeHead(200, {"Content-Type": contentType});
            response.end(content, "utf-8");
        }
    });
})

let roomId = "";
const wsServer = new WebSocketServer({server: httpServer});
/**
 * @param {WebSocketClient} ws 
 */
const connected = (ws) => {
    if( wsServer.getClients().length%2 === 1 ) {
        roomId = ws.getId();
        ws.send({type: "waiting", value: "waiting for opponent..."})
    }else {
        const clients = wsServer.searchClients("room", roomId);
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
        wsServer.searchClients("room", ws.attr["room"]).forEach((wsc) => {
            wsc.send({type: "put", value: message.value});
        });
    }
}
/**
 * @param {WebSocketClient} ws 
 */
const close = (ws) => {
    wsServer.searchClients("room", ws.attr["room"]).forEach((wsc) => {
        wsc.send({type: "end", value: "対戦相手との通信が切れました。"});
    });
    console.log("ばいばい");
}

httpServer.listen(process.env.PORT || 8080);
wsServer.start(connected, receve, close);
