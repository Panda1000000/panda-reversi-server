import {Message} from "./Message.js"

export class WebSocketClient {
    static TYPE_CONNECT = "connect";
    /**
     * @param {string} uri 
     * @param {(message: import("./Message.js").MessageObject) => void} callback 
     */
    constructor(uri, callback) {
        /** @private  */
        this._id  = "";
        /** @private  */
        this._isConected = false;
        /** @private  */
        this._ws  = new WebSocket(uri);

        this._ws.addEventListener("open", (e) => {
            console.log("接続成功。");
        });

        this._ws.addEventListener("message", (e) => {
            const msg = Message.parse(e.data);
            if( msg.type === WebSocketClient.TYPE_CONNECT ) {
                this._id = msg.value;
            }else {
                callback(msg);
            }
        });
    }
    /**
     * @param {import("./Message.js").MessageObject} message 
     */
    sendMessage(message) {
        this._ws.send(Message.stringify(message));
    }

    getConnected() {
        return this._isConected;
    }
}