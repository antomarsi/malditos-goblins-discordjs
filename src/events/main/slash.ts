import { CommandInteractionOptionResolver, DiscordjsErrorCodes, Events } from "discord.js";
import { client } from "../..";
import { Event } from "../../structs/types/Event";


export default new Event({
    name: Events.InteractionCreate,
    async run(interaction) {
        if (interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName)
            if (!command || !command.autoComplete) return;
            await command.autoComplete(interaction);
            return
        }
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName)
            if (!command) return;

            const options = interaction.options as CommandInteractionOptionResolver
            try {

                await command.run({
                    client,
                    interaction,
                    options
                })
            } catch (error) {
                console.error(error)
            }
            return
        }
    }
})
