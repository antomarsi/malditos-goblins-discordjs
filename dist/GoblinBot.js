"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const GoblinCommand_1 = require("./Commands/GoblinCommand");
const Log_1 = require("./Log");
class GoblinBot {
    constructor() {
        this.client = new discord_js_1.Client();
        this.commands = [];
        this.prefix = "~goblin";
        Log_1.logEvent("Loading commands");
        this.loadCommands();
    }
    start(token) {
        console.log("Starting bot...");
        this.client.on("ready", () => {
            this.botId = this.client.user.id;
            Log_1.logEvent(`Bot Connected.`);
            Log_1.logEvent(`Logged in as ${this.client.user.tag}`);
            this.client.user.setActivity("Use ~goblin ajuda");
            console.log("Bot Connected.");
        });
        this.client.on("message", msg => {
            if (msg.content.startsWith(this.prefix)) {
                Log_1.logEvent(`Command Accepted: ${msg.content}`);
                this.commands.some(command => {
                    return command.process(msg);
                });
            }
        });
        this.client.on("error", Log_1.logError);
        this.client.on("warn", Log_1.logWarn);
        process.on("exit", () => {
            Log_1.logEvent(`Bot Process exit.`);
            this.client.destroy();
        });
        process.on("uncaughtException", (err) => {
            const errorMsg = (err ? err.stack || err : "")
                .toString()
                .replace(new RegExp(`${__dirname}\/`, "g"), "./");
            Log_1.logError(errorMsg);
        });
        this.client.login(token);
    }
    loadCommands() {
        this.commands.push(new GoblinCommand_1.default());
    }
}
exports.GoblinBot = GoblinBot;
//# sourceMappingURL=GoblinBot.js.map