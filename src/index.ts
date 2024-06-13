import * as dotenv from "dotenv";
import { ExtendClient } from "./structs/ExtendedClient";

dotenv.config()

const client = new ExtendClient()

export { client }

client.start(process.env.DISCORD_BOT_TOKEN as string)
