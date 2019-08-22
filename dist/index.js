"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GoblinBot_1 = require("./GoblinBot");
const dotenv = require("dotenv");
const index_1 = require("./Log/index");
dotenv.config();
if (!process.env.TOKEN) {
    index_1.logError("TOKEN não informado!");
}
else {
    const bot = new GoblinBot_1.GoblinBot();
    bot.start(process.env.TOKEN);
}
//# sourceMappingURL=index.js.map