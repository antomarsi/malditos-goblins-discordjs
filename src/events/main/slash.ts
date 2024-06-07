import { CommandInteractionOptionResolver, Events } from "discord.js";
import { client } from "../..";
import { Event } from "../../structs/types/Event";


export default new Event({
    name: Events.InteractionCreate,
    run(interaction) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName)
        if (!command) return;

        const options = interaction.options as CommandInteractionOptionResolver

        command.run({
            client,
            interaction,
            options
        })
    }
})