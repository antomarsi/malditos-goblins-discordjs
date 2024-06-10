"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendClient = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const path = tslib_1.__importStar(require("path"));
const fs = tslib_1.__importStar(require("fs"));
const fileCondition = (fileName) => fileName.endsWith(".ts") || fileName.endsWith(".js");
class ExtendClient extends discord_js_1.Client {
    commands = new discord_js_1.Collection();
    buttons = new discord_js_1.Collection();
    selects = new discord_js_1.Collection();
    modals = new discord_js_1.Collection();
    constructor() {
        super({
            intents: [discord_js_1.GatewayIntentBits.Guilds], partials: [
                discord_js_1.Partials.Message, discord_js_1.Partials.User
            ]
        });
    }
    start(botToken) {
        this.registerModules();
        this.registerEvents();
        this.login(botToken);
    }
    registerCommands(commands) {
        this.application?.commands.set(commands).then(() => {
            console.log("✅ Slash command defined".green);
        }).catch(e => console.log(`❌ An error occurred while trying to define Slash Commands: \n${e}`.red));
    }
    registerModules() {
        const slashCommands = new Array();
        const commandsPath = path.join(__dirname, "..", "commands");
        fs.readdirSync(commandsPath).forEach(local => {
            fs.readdirSync(commandsPath + `/${local}/`).filter(fileCondition).forEach(async (fileName) => {
                const command = (await Promise.resolve(`${`../commands/${local}/${fileName}`}`).then(s => tslib_1.__importStar(require(s))))?.default;
                const { name, buttons, selects, modals } = command;
                if (name) {
                    this.commands.set(name, command);
                    slashCommands.push(command);
                    if (buttons)
                        buttons.forEach((run, key) => this.buttons.set(key, run));
                    if (selects)
                        selects.forEach((run, key) => this.selects.set(key, run));
                    if (modals)
                        modals.forEach((run, key) => this.modals.set(key, run));
                }
            });
        });
        this.on("ready", () => this.registerCommands(slashCommands));
    }
    registerEvents() {
        const eventsPath = path.join(__dirname, "..", "events");
        fs.readdirSync(eventsPath).forEach(local => {
            fs.readdirSync(`${eventsPath}/${local}`).filter(fileCondition).forEach(async (fileName) => {
                const { name, once, run } = (await Promise.resolve(`${`../events/${local}/${fileName}`}`).then(s => tslib_1.__importStar(require(s))))?.default;
                try {
                    if (name)
                        (once) ? this.once(name, run) : this.on(name, run);
                }
                catch (error) {
                    console.log(`An erro occurred on event: ${name}: \n${error}`.red);
                }
            });
        });
    }
}
exports.ExtendClient = ExtendClient;
