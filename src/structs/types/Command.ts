import { ApplicationCommandData, AutocompleteInteraction, ButtonInteraction, Collection, CommandInteraction, CommandInteractionOptionResolver, ModalSubmitInteraction, StringSelectMenuInteraction } from "discord.js";
import { ExtendClient } from "../ExtendedClient";


export interface CommandProps {
    client: ExtendClient,
    interaction: CommandInteraction,
    options: CommandInteractionOptionResolver
}

export type ComponentsButton = Collection<string, (interaction: ButtonInteraction) => void>
export type ComponentsSelect = Collection<string, (interaction: StringSelectMenuInteraction) => void>
export type ComponentsModal = Collection<string, (interaction: ModalSubmitInteraction) => void>

interface CommandsComponents {
    buttons?: ComponentsButton,
    selects?: ComponentsSelect,
    modals?: ComponentsModal
}

export type CommandType = ApplicationCommandData & CommandsComponents & {
    run(props: CommandProps): void
    autoComplete?: (interaction: AutocompleteInteraction) => void
}

export class Command {
    constructor(options: CommandType) {
        options.dmPermission = false;
        Object.assign(this, options)
    }
}
