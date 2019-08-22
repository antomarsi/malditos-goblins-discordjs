import { Message } from "discord.js";
import { ICommand } from "./index";
export default class GoblinCommand implements ICommand {
    command: string;
    process(msg: Message): boolean;
    generateGoblin(name?: string): string;
    getHelp(): string;
}
