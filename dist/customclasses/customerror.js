"use strict";
class CustomError extends Error {
    constructor(message) {
        super();
        this.mesg = "";
        this.getMessage = () => {
            return this.mesg;
        };
        this.mesg = message;
    }
}
