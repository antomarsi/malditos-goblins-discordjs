import { Events } from "discord.js";
import { client } from "../.."
import { Event } from "../../structs/types/Event";


export default new Event({
    name: Events.ClientReady,
    once: true,
    run() {
        const { commands, buttons, selects, modals } = client;

        console.log(`Commands   loaded: ${commands.size}`.cyan)
        console.log("✅ Bot online".green)
    }
})
