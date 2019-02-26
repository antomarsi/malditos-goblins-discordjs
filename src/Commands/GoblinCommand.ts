import { ICommand } from './Interfaces';
import { Message } from 'discord.js';
import Goblin from '../Goblin';

export default class GoblinCommand implements ICommand {
  process(msg: Message) {
    if (msg.content.startsWith("~goblin help")) {
      msg.channel.send(this.getHelp());
      return true;
    }
    return true;
  }

  createGoblin(name?:string): string {
    let goblin = new Goblin(name);
    return `\`\`\`md
    #JOGADOR: ${msg.author.tag}
    #Ocupação: ${goblin.ocupation.name}
    #Coloração: ${goblin.coloration.name}
    #Caracteristica: ${goblin.feature}
    ========================================
    #Combate: ${goblin.combat}
    #Habilidade: ${goblin.skill}
    #Conhecimento: ${goblin.knowledge}
    #Sorte: ${goblin.luck}\`\`\``;
  }

  getHelp(): string {
return `\`\`\`css
use os comandos abaixo:
~goblin new - Cria um novo goblin
\`\`\``
  }
}