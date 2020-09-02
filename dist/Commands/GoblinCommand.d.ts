import { Message, MessageEmbed } from 'discord.js';
import { ICommand } from './index';
export default class GoblinCommand implements ICommand {
    command: string;
    process(msg: Message): boolean;
    generateGoblin(name?: string): MessageEmbed;
    getHelp(): MessageEmbed;
}
