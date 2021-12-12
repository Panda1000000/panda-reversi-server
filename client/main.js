import {UI} from "./UI/UI.js";
import {Othello} from "./Othello/Othello.js"
import {WebSocketClient} from "./WebSocket/WebScoketClient.js";

class App {
    static COLOR = "";
    static NOW   = Othello.BLACK;

    constructor() {
        const msgbox = document.getElementById("msgbox");
        this.ui = new UI(300, 300, undefined);
        this.othello = new Othello();
        this.ui.showOthello(this.othello);

        const callback = (message) => {
            if ( message.type == "waiting" ) {
                msgbox.innerHTML = message.value;
            } else if ( message.type == "matching" ) {
                App.COLOR = message.value;
                msgbox.innerHTML = "対戦ちゅう";

            } else if ( message.type == "put" ) {
                const x = JSON.parse(message.value.split(",")[0]);
                const y = JSON.parse(message.value.split(",")[1]);
                this.othello.put({x, y});
                App.NOW = this.othello.getTurn;
                this.ui.showOthello(this.othello);

            } else if ( message.type == "end" ) {
                alert(message.value)
            } else {
                // Console.WriteLine("type: " + message.type+ "\tvalue: "+message.value);
            }
        };

        this.wsClient = new WebSocketClient("ws://panda-othello-server.herokuapp.com/", callback.bind(this));
        this.ui.addClickEvent(this.onClick.bind(this));
    }

    onClick(e) {
        const x = Math.floor(e.x / (this.ui.getWidth / 8) + 1);
        const y = Math.floor(e.y / (this.ui.getHeight / 8) + 1);
        if ( this.wsClient.getConnected() ) { return; }
        if (x > 9 || y > 9) { return ; }
        if ( (App.COLOR == "BLACK" && this.othello.getTurn == Othello.WHITE) || App.COLOR == "WHITE" && this.othello.getTurn == Othello.BLACK ) {
            alert("Not your turn."); return ;
        }
          if (!this.othello.put({ x, y })) {
            return;
        }
        App.NOW = this.othello.getTurn;
        this.ui.showOthello(this.othello);
        this.wsClient.sendMessage( {type: "put", value: "" + x + "," + y} );
    }
}

window.onload = () => {
    new App();
}
