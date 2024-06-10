import * as dotenv from "dotenv";
import { ExtendClient } from "./structs/ExtendedClient";
import { Events } from "discord.js";
export * from "colors";

dotenv.config()

const client = new ExtendClient()

export { client }

client.start(process.env.DISCORD_BOT_TOKEN as string)
