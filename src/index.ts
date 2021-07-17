import { GoblinBot } from './GoblinBot'
import * as dotenv from 'dotenv'
import { Logger } from 'tslog';

dotenv.config()

const logger =  new Logger({name: "Malditos Goblins Bot"});

if (!process.env.TOKEN) {
  logger.error("Token not informed!")
} else {
  const bot: GoblinBot = new GoblinBot(logger)
  bot.start(process.env.TOKEN as string)
}
