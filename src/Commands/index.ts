import { Message } from 'discord.js';

export interface ICommand {
  process(msg: Message): boolean;
  getHelp(): void;
}