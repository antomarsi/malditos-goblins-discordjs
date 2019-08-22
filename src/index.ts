import { GoblinBot } from "./GoblinBot";
import * as dotenv from "dotenv";
import { logError } from './Log/index';

dotenv.config();
if (!process.env.TOKEN) {
  logError("TOKEN não informado!");
} else {
  const bot: GoblinBot = new GoblinBot();
  bot.start(process.env.TOKEN as string);
}
