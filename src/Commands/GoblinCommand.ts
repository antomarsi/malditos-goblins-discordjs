import { ICommand } from "../Interfaces";
import { Message } from "discord.js";
import Goblin from "../Goblin";

export default class GoblinCommand implements ICommand {
  process(msg: Message) {
    if (msg.content === "~goblin help") {
      msg.channel.send(this.getHelp());
      return true;
    }
    if (msg.content === "~goblin new") {
      msg.channel.send(`\`\`\`md
      #JOGADOR: ${msg.author.tag}
      ${this.generateGoblin()}
      \`\`\``);
    }
    return true;
  }

  generateGoblin(name?: string): string {
    let goblin = new Goblin(name);
    return `#Ocupação: ${goblin.ocupacao.nome}
    #Coloração: ${goblin.coloracao.nome}
    #Caracteristica: ${goblin.caracteristica.toString()}
    ========================================
    #Habilidades:
    ${goblin.ocupacao.habilidades
      .map((hab, index) => `*${index + 1} - ${hab}\n`)
      .join()}
    ========================================
    #Combate: ${goblin.combate}
    #Habilidade: ${goblin.habilidade}
    #Conhecimento: ${goblin.conhecimento}
    #Sorte: ${goblin.sorte}
    ========================================
    Equipamentos():
    ${goblin.ocupacao.equipamento.getRandomEquipamento()}
    `;
  }

  getHelp(): string {
    return `\`\`\`css
use os comandos abaixo:
~goblin new - Cria um novo goblin
\`\`\``;
  }
}
