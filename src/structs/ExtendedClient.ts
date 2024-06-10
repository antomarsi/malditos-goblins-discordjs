import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection, GatewayIntentBits, Partials } from "discord.js";
import { Command, CommandType, ComponentsButton, ComponentsModal, ComponentsSelect } from "./types/Command";
import path from "path";
import fs from "fs";
import { EventType } from "./types/Event";

const fileCondition = (fileName: string) => fileName.endsWith(".ts") || fileName.endsWith(".js")

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
            console.log("✅ Slash command defined".green)
        }).catch(e => console.log(`❌ An error occurred while trying to define Slash Commands: \n${e}`.red))
    }

    private registerModules() {
        const slashCommands: Array<ApplicationCommandDataResolvable> = new Array();

        const commandsPath = path.join(__dirname, "..", "commands")

        fs.readdirSync(commandsPath).forEach(local => {
            fs.readdirSync(commandsPath + `/${local}/`).filter(fileCondition).forEach(async fileName => {
                const command: CommandType = (await import(`../commands/${local}/${fileName}`))?.default
                const { name, buttons, selects, modals } = command

                if (name) {
                    this.commands.set(name, command)
                    slashCommands.push(command)
                    if (buttons) buttons.forEach((run, key) => this.buttons.set(key, run))
                    if (selects) selects.forEach((run, key) => this.selects.set(key, run))
                    if (modals) modals.forEach((run, key) => this.modals.set(key, run))
                }
            })
        })



        this.on("ready", () => this.registerCommands(slashCommands))
    }
    private registerEvents() {
        const eventsPath = path.join(__dirname, "..", "events");

        fs.readdirSync(eventsPath).forEach(local => {
            fs.readdirSync(`${eventsPath}/${local}`).filter(fileCondition).forEach(async fileName => {
                const { name, once, run }: EventType<keyof ClientEvents> = (await import(`../events/${local}/${fileName}`))?.default
                try {
                    if (name) (once) ? this.once(name, run) : this.on(name, run)

                } catch (error) {
                    console.log(`An erro occurred on event: ${name}: \n${error}`.red)
                }

            })
        })
    }
}