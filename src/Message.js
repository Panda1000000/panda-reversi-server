/**
 * @typedef {{"type": string, "value": string}} MessageObject
 */

module.exports = class Message {
    /**
     * @param {string} str 
     */
    static parse(str) {
        const arr = str.split(":");
        return {
            "type": arr.shift(),
            "value": arr.join(""),
        }
    }
    /**
     * @param { MessageObject } obj 
     */
    static stringify(obj) {
        return obj.type + ":" + obj.value;
    }
}