"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const __1 = require("../..");
const Event_1 = require("../../structs/types/Event");
exports.default = new Event_1.Event({
    name: discord_js_1.Events.ClientReady,
    once: true,
    run() {
        const { commands, buttons, selects, modals } = __1.client;
        console.log(`Commands   loaded: ${commands.size}`.cyan);
        console.log("✅ Bot online".green);
    }
});
