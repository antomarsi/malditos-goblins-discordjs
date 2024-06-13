import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection, GatewayIntentBits, Partials } from "discord.js";
import { CommandType, ComponentsButton, ComponentsModal, ComponentsSelect } from "./types/Command";
import logger from "../utils/logger";
import components from "../events/main/components";
import ready from "../events/main/ready";
import slash from "../events/main/slash";
import { Event } from "./types/Event";
import { Command } from "./types/Command";
import goblinsMalditos from "../commands/common/goblins-malditos";

export class ExtendClient extends Client {

    public commands: Collection<string, CommandType> = new Collection()
    public buttons: ComponentsButton = new Collection()
    public selects: ComponentsSelect = new Collection()
    public modals: ComponentsModal = new Collection()

    constructor() {
        super({
            intents: [GatewayIntentBits.Guilds], partials: [
                Partials.Message, Partials.User
            ]
        })
    }
    public start(botToken: string) {
        this.registerModules()
        this.registerEvents()
        this.login(botToken)
    }

    private registerCommands(commands: Array<ApplicationCommandDataResolvable>) {
        this.application?.commands.set(commands).then(() => {
            logger.info("✅ Slash command defined")
        }).catch(e => logger.fatal(`❌ An error occurred while trying to define Slash Commands: \n${e}`))
    }

    private registerModules() {
        const slashCommands: Array<ApplicationCommandDataResolvable> = [];

        const commands : Command[] = [
            goblinsMalditos
        ]

        commands.forEach(command => {
            const { name, buttons, selects, modals } = command as CommandType
            if (name) {
                this.commands.set(name, command as CommandType)
                slashCommands.push(command as CommandType)
                if (buttons) buttons.forEach((run, key) => this.buttons.set(key, run))
                if (selects) selects.forEach((run, key) => this.selects.set(key, run))
                if (modals) modals.forEach((run, key) => this.modals.set(key, run))
            }
        });




        this.on("ready", () => this.registerCommands(slashCommands))
    }
    private registerEvents() {

        const events: Event<keyof ClientEvents>[] = [
            components,
            ready,
            slash
        ]

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        events.forEach(({ name, once, run }:any) => {
            try {
                if (name) (once) ? this.once(name, run) : this.on(name, run)

            } catch (error) {
                logger.fatal(`An erro occurred on event: ${name}: \n${error}`)
            }
        });
    }
}
