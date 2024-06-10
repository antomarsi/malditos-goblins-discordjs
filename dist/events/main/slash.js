"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const __1 = require("../..");
const Event_1 = require("../../structs/types/Event");
exports.default = new Event_1.Event({
    name: discord_js_1.Events.InteractionCreate,
    async run(interaction) {
        if (interaction.isAutocomplete()) {
            const command = __1.client.commands.get(interaction.commandName);
            if (!command || !command.autoComplete)
                return;
            await command.autoComplete(interaction);
            return;
        }
        if (interaction.isChatInputCommand()) {
            const command = __1.client.commands.get(interaction.commandName);
            if (!command)
                return;
            const options = interaction.options;
            try {
                await command.run({
                    client: __1.client,
                    interaction,
                    options
                });
            }
            catch (error) {
                console.error(error);
            }
            return;
        }
    }
});
