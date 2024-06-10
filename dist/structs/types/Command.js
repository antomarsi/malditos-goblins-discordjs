"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
class Command {
    constructor(options) {
        options.dmPermission = false;
        Object.assign(this, options);
    }
}
exports.Command = Command;
