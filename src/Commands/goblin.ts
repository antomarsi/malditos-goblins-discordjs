import {
  SlashCommand,
  CommandOptionType,
  SlashCreator,
  CommandContext,
  InteractionResponseFlags,
  EmbedField
} from 'slash-create';
import Goblin from '../Goblin';

export default class HelloCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'goblin',
      description: 'Cria um novo goblin',
      options: [
        {
          type: CommandOptionType.STRING,
          name: 'nome',
          description: 'Nome do seu goblin, se não informado, será gerado automaticamente'
        }
      ]
    });
  }

  async run(ctx: CommandContext) {
    const goblin = Goblin.generateGoblin(ctx.options.nome ?? undefined);
    const fields: EmbedField[] = [];
    const user = ctx.member?.mention ?? ctx.user.mention;

    fields.push({ name: 'Nome gerado:', value: goblin.nome, inline: true });
    fields.push({ name: 'Ocupação:', value: goblin.ocupacao.nome, inline: true });
    fields.push({ name: 'Coloração:', value: goblin.coloracao.nome, inline: true });
    fields.push({ name: 'Caracteristica:', value: goblin.caracteristica.nome, inline: true });
    fields.push({
      name: ':crossed_swords: Combate',
      value: goblin.combate.toString(),
      inline: true
    });
    fields.push({
      name: ':man_running: Habilidade',
      value: goblin.habilidade.toString(),
      inline: true
    });
    fields.push({
      name: ':books: Conhecimento',
      value: goblin.conhecimento.toString(),
      inline: true
    });
    fields.push({
      name: ':four_leaf_clover: Sorte',
      value: goblin.sorte.toString(),
      inline: true
    });

    goblin.ocupacao.habilidades.forEach((skill, index) => {
      fields.push({ name: `Level ${index + 1} - ${skill.name}`, value: skill.description });
    });

    fields.push({
      name: `Equipamentos iniciais:`,
      value: goblin.ocupacao.equipamento
    });
    // TODO Fix the response
    await ctx.send({
      content: "teste",
      embeds: [
        {
          color: goblin.cor,
          title: `Uma nova *Coisinha Verde©* (ou de outra cor) foi criada`,
          fields
        }
      ]
    });
  }
}
