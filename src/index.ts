import { GoblinBot } from "./GoblinBot";
import * as dotenv from "dotenv";
import * as debug from "debug";

dotenv.config();
if (!process.env.TOKEN) {
    debug("bot:error")("TOKEN não informado!");
} else {
    const bot: GoblinBot = new GoblinBot();
    bot.start(process.env.TOKEN as string);
}
    