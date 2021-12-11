const WebSocket = require("ws");
const Message   = require("./Message");

module.exports = class WebSocketClient {
    /**
     * @param {WebSocket} ws 
     * @param {string} id
     */
    constructor(ws, id) {
        this._ws = ws;
        this._ws.id = id;
        this.attr = {};
    }

    /**
     * @param { Message.MessageObject } message 
     */
    send(message) {
        this._ws.send(Message.stringify(message));
    }

    /**
     * @returns {string} id
     */
    getId() {
        return this._ws.id;
    }
}
