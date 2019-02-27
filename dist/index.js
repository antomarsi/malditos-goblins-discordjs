"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GoblinBot_1 = require("./GoblinBot");
const dotenv = require("dotenv");
const log_1 = require("./log");
dotenv.config();
if (!process.env.TOKEN) {
    log_1.logError("TOKEN não informado!");
}
else {
    const bot = new GoblinBot_1.GoblinBot();
    bot.start(process.env.TOKEN);
}
require('http').createServer().listen(3000);
//# sourceMappingURL=index.js.map