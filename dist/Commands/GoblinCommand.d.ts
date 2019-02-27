import { ICommand } from "../Interfaces";
import { Message } from "discord.js";
export default class GoblinCommand implements ICommand {
    command: string;
    process(msg: Message): boolean;
    generateGoblin(name?: string): string;
    getHelp(): string;
}
