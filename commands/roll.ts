import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';
import { randomInt } from '../utils/math';

export default class HelloCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'roll',
      description: 'Rola N dados limite de 6.',
      options: [
        {
          type: CommandOptionType.INTEGER,
          name: 'quantidade',
          description: 'Quantidade de dados',
          max_value: 6,
          min_value: 1,
          required: true
        }
      ]
    });
  }

  async run(ctx: CommandContext) {
    const dados: number[] = [];
    const quantidade: number = ctx.options.quantidade;

    for (let index = 0; index < quantidade; index++) {
      dados.push(randomInt(1, 6));
    }
    const user = ctx.member?.mention ?? ctx.user.mention;

    let message = `${user} rolou ${quantidade} dados, resultado: [${dados.join(', ')}].`;
    if (dados.every((value) => value === 1)) {
      message += '\nTodos os dados são 1, seu goblin **explodiu!** (em milhões de pedacinhos)';
    }

    await ctx.send(message);
  }
}
