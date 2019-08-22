import { Message } from "discord.js";
import Goblin from "../Goblin";
import { ICommand } from "./index";

export default class GoblinCommand implements ICommand {
  public command: string = "general";

  process(msg: Message) {
    if (msg.content === "~goblin ajuda" || msg.content === "~goblin") {
      msg.channel.send(this.getHelp());
      return true;
    } else if (msg.content === "~goblin novo") {
      msg.channel.send(`<@${
        msg.author.id
      }> criou uma nova *Coisinha Verde©* (ou de outra cor)\`\`\`md
${this.generateGoblin()}\`\`\``);
      return true;
    } else if (msg.content === "~goblin saiba-mais") {
      msg.author.send(
        "Você é bem bacana em querer saber mais sobre o criador de Malditos Goblins =D\nAqui está o site: http://www.coisinhaverde.com.br/"
      );
      return true
    }
    return false;
  }

  generateGoblin(name?: string): string {
    let goblin = new Goblin(name);
    let text: string[] = [];
    text.push(`#Nome Sugerido: ${goblin.nome}`);
    text.push(`#Ocupação: ${goblin.ocupacao.nome}`);
    text.push(`#Coloração: ${goblin.coloracao.nome}`);
    text.push(`#Caracteristica: ${goblin.caracteristica.toString()}`);
    text.push("========================================");
    text.push("#Habilidades:");
    goblin.ocupacao.habilidades.forEach((hab, index) => {
      text.push(` - Level ${index + 1} - ${hab.nome}: ${hab.descricao}`);
    });
    text.push("========================================");
    text.push(`#Combate: ${goblin.combate}`);
    text.push(`#Habilidade: ${goblin.habilidade}`);
    text.push(`#Conhecimento: ${goblin.conhecimento}`);
    text.push(`#Sorte: ${goblin.sorte}`);
    text.push(`========================================`);
    text.push(`#Equipamentos:`);
    text.push(`- ${goblin.ocupacao.equipamento}`);
    return text.join("\n");
  }

  getHelp(): string {
    return `\`\`\`css
Use os comandos abaixo:
~goblin ajuda - Mostra a lista de comandos
~goblin novo - Cria um novo goblin
~goblin saiba-mais - Envia em privado o link para o site do CoisinhaVerde =D
\`\`\``;
  }
}
