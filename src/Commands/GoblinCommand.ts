import { ICommand } from "../Interfaces";
import { Message } from "discord.js";
import Goblin from "../Goblin";
import { logSystem } from "../log";

export default class GoblinCommand implements ICommand {
  public command: string = "general";

  process(msg: Message) {
    if (msg.content.startsWith("~goblin ajuda")) {
      msg.channel.send(this.getHelp());
      return true;
    } else if (msg.content === "~goblin novo") {
      msg.channel.send(`<@${msg.author.id}> criou uma nova *Coisinha Verde©* (ou de outra cor)\`\`\`md
${this.generateGoblin()}\`\`\``);
      return true;
    } else if (msg.content === "~goblin saiba-mais") {
      msg.author.send("Você é bem bacana em querer saber mais sobre o criador de Malditos Goblins =D\nAqui está o site: http://www.coisinhaverde.com.br/");
    }
    return false;
  }

  generateGoblin(name?: string): string {
    let goblin = new Goblin(name);
    return `#Ocupação: ${goblin.ocupacao.nome}
#Coloração: ${goblin.coloracao.nome}
#Caracteristica: ${goblin.caracteristica.toString()}
========================================
#Habilidades:
${goblin.ocupacao.habilidades
  .map((hab, index) => ` - Level ${index + 1} - ${hab.nome}: ${hab.descricao}`)
  .join("\n")}
========================================
#Combate: ${goblin.combate}
#Habilidade: ${goblin.habilidade}
#Conhecimento: ${goblin.conhecimento}
#Sorte: ${goblin.sorte}
========================================
#Equipamentos:
 - ${goblin.ocupacao.equipamento}`;
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
