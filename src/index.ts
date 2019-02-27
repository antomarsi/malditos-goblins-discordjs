import { GoblinBot } from "./GoblinBot";
import * as dotenv from "dotenv";
import { logError } from "./log";

dotenv.config();
if (!process.env.TOKEN) {
    logError("TOKEN não informado!");
} else {
    const bot: GoblinBot = new GoblinBot();
    bot.start(process.env.TOKEN as string);
}
require('http').createServer().listen(3000)