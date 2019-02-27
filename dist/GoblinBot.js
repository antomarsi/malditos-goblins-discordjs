"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const GoblinCommand_1 = require("./Commands/GoblinCommand");
const log_1 = require("./log");
class GoblinBot {
    constructor() {
        this.client = new discord_js_1.Client();
        this.commands = [];
        this.prefix = "~goblin";
    }
    start(token) {
        console.log("Starting bot...");
        this.client.on("ready", () => {
            this.botId = this.client.user.id;
            log_1.logEvent(`Bot Connected.`);
            log_1.logEvent(`Logged in as ${this.client.user.tag}`);
            this.client.user.setActivity("Use ~goblin ajuda");
            this.loadCommands();
        });
        this.client.on("message", msg => {
            if (msg.content.startsWith(this.prefix)) {
                log_1.logEvent(`Command Accepted: ${msg.content}`);
                this.commands.forEach(command => {
                    return command.process(msg);
                });
            }
        });
        this.client.on("error", log_1.logError);
        this.client.on("warn", log_1.logWarn);
        process.on("exit", () => {
            log_1.logEvent(`Bot Process exit.`);
            this.client.destroy();
        });
        process.on("uncaughtException", (err) => {
            const errorMsg = (err ? err.stack || err : "")
                .toString()
                .replace(new RegExp(`${__dirname}\/`, "g"), "./");
            log_1.logError(errorMsg);
        });
        process.on("unhandledRejection", (err) => {
            log_1.logError("Uncaught Promise error: \n" + err.stack);
        });
        this.client.login(token);
    }
    loadCommands() {
        this.commands.push(new GoblinCommand_1.default());
    }
}
exports.GoblinBot = GoblinBot;
//# sourceMappingURL=GoblinBot.js.map