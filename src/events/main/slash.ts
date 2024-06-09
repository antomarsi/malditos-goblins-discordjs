import { CommandInteractionOptionResolver, Events } from "discord.js";
import { client } from "../..";
import { Event } from "../../structs/types/Event";


export default new Event({
    name: Events.InteractionCreate,
    async run(interaction) {
        if (interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName)
            if (!command || !command.autoComplete) return;
            command.autoComplete(interaction);
            return
        }
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName)
            if (!command) return;

            const options = interaction.options as CommandInteractionOptionResolver

            command.run({
                client,
                interaction,
                options
            })
            return
        }
    }
})
