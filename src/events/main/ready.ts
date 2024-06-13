import { Events } from "discord.js";
import { client } from "../.."
import { Event } from "../../structs/types/Event";
import logger from "../../utils/logger";


export default new Event({
    name: Events.ClientReady,
    once: true,
    run() {
        const { commands } = client;

        logger.info(`Commands   loaded: ${commands.size}`)
        logger.info("✅ Bot online")
    }
})
