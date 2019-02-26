import { Client, Message } from 'discord.js'
import GoblinCommand from './Commands/GoblinCommand';
import { ICommand } from './Commands/Interfaces';
import * as debug from 'debug';
import * as path from 'path';
import Goblin from './Goblin';

const logSystem	= debug('bot:system');
const logEvent	= debug('bot:event');
const logError	= debug('bot:error');
const logWarn	= debug('bot:warn');
export class GoblinBot {
  private client: Client = new Client();
  private botId: string;
  private player_goblins: Goblin[] = [];
  private commands: ICommand[] = [];
  private prefix:string = "~goblin";

  public start(token: string): void {
    console.log('Starting bot...');

		this.client.on('ready', () => {
      this.botId = this.client.user.id
      logEvent(`Bot Connected.`)
      logEvent(`Logged in as ${ this.client.user.tag }`)
			this.client.user.setActivity('Use ~goblin help');
    });
    
    this.client.on('message', msg => {
      if (msg.content.startsWith(this.prefix)) {
        this.commands.forEach(command => command.process(msg));
      }
    });

    this.client.on('error', logError)

    this.client.on('warn', logWarn)

    process.on('exit', () => {
      logEvent(`Bot Process exit.`)
      this.client.destroy()
    })

    process.on('uncaughtException', (err: Error) => {
      const errorMsg = (err ? err.stack || err : '').toString().replace(new RegExp(`${__dirname}\/`, 'g'), './')
      logError(errorMsg)
    });

    process.on('unhandledRejection', (err: Error) => {
      logError('Uncaught Promise error: \n' + err.stack)
    });

		this.client.login(token);
  }

  loadCommands() {
    this.commands.push(new GoblinCommand())
  }
}
