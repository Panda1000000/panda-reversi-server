const WebSocket = require("ws");
const Message   = require("./Message")
const WebSocketClient = require("./WebSocketClient");
const crypto = require("crypto");
const http   = require("http");

module.exports = class WebSocketServer {
    /**
     * @param {Object} params 
     * @param {number?} params.port
     * @param {string?} params.host
     * @param {http.Server?} params.server
     */
    constructor(params) {
        if( params.server ) {
            this._server = new WebSocket.Server({server: params.server});
        }else if ( !(params.host) ) {
            this._server = new WebSocket.Server({port: params.port});
        }else {
            this._server = new WebSocket.Server({port: params.port, host: params.host});
        }
        /**
         * @type {Object.<string, WebSocketClient>}
         */
        this._clients = {}
    }

    /**
     * @param {(ws: WebSocketClient) => void} connected 
     * @param {(ws: WebSocketClient, message: Message.MessageObject) => void} receve 
     * @param {(ws: WebSocketClient) => void} close 
     */
    start(connected, receve, close) {
        this._server.on("connection", (ws) => {
            (() => {
                const client = new WebSocketClient(ws, this._generateId() );
                this._clients[ws.id] = client;
                client.send({"type": "connect", "value": client.getId()});
                connected( client );
            })();

            ws.on("message", (message) => {
                receve(this._clients[ws.id], Message.parse(message.toString()));
            });

            ws.on("close", () => {
                close(this._clients[ws.id]);
                delete this._clients[ws.id];
            });
        });
    }

    /**
     * @param { Message.MessageObject } message 
     */
    sendAll(message) {
        this._server.clients.forEach((ws) => {
            ws.send( Message.stringify(message) );
        })
    }
    getClients() { return Object.values(this._clients); }
    /**
     * @param {string} key 
     * @param {any} value 
     */
    searchClients(key, value) {
        return Object.values(this._clients).filter((wsc) => {
            return wsc.attr[key] === value;
        });
    }

    /**
     * @private
     */
    _generateId() {
        let id = "";
        do {
            id = crypto.randomBytes(20+2).toString("base64").replace(/\W/g, "").substring(0, 20);
        }while( Object.keys(this._clients).indexOf(id) !== -1 );
        return id;
    }
}
