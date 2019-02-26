import { GoblinBot } from './GoblinBot';
import * as dotenv from "dotenv";

dotenv.config();

const bot: GoblinBot = new GoblinBot();
bot.start(process.env.TOKEN as string);