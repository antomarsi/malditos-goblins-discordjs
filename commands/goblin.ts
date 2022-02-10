import {
  SlashCommand,
  CommandOptionType,
  SlashCreator,
  CommandContext,
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
    const goblin = new Goblin(ctx.options.nome ?? undefined);
    const fields: EmbedField[] = [];
    const user = ctx.member?.displayName ?? ctx.user.username;

    fields.push({ name: 'Nome:', value: goblin.nome, inline: true });
    fields.push({ name: 'Ocupação:', value: goblin.ocupacao.nome, inline: true });
    fields.push({ name: 'Coloração:', value: goblin.coloracao.nome, inline: true });
    fields.push({ name: 'Caracteristica:', value: goblin.caracteristica.nome, inline: true });

    const status = [
      {
        icon: ':crossed_swords:',
        name: 'Combate',
        value: goblin.combate
      },
      {
        icon: ':man_running:',
        name: 'Habilidade',
        value: goblin.habilidade
      },
      {
        icon: ':books:',
        name: 'Conhecimento',
        value: goblin.conhecimento
      },
      {
        icon: ':four_leaf_clover:',
        name: 'Sorte',
        value: goblin.sorte
      }
    ];
    fields.push({
      name: 'Status',
      value: status.map(({ icon, name, value }) => `${icon} ${name}: ${value}`).join('\n')
    });

    goblin.ocupacao.habilidades.forEach((skill, index) => {
      fields.push({ name: `Level ${index + 1} - ${skill.nome}`, value: skill.descricao });
    });

    fields.push({
      name: `Equipamentos iniciais:`,
      value: goblin.ocupacao.equipamento
    });
    await ctx.send({
      embeds: [
        {
          author: {
            name: user
          },
          color: goblin.cor,
          title: `Uma nova *Coisinha Verde©* (ou de outra cor) foi criada`,
          fields: fields,
          thumbnail: {
            url: 'https://miro.medium.com/max/540/0*v3Esf0m1A-bbwd9i.png'
          }
        }
      ]
    });
  }
}
