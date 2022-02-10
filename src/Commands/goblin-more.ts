import { SlashCommand, CommandOptionType, SlashCreator, CommandContext, InteractionResponseFlags } from 'slash-create';

export default class HelloCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'goblin-more',
      description: 'Saiba mais sobre "Malditos Goblins".'
    });
  }

  async run(ctx: CommandContext) {
    await ctx.defer(true)
    await ctx.send(`Você é bem bacana em querer saber mais sobre o criador de Malditos Goblins =D\nAqui está o site: https://coisinhaverde.com.br/jogos/portfolio/malditos-goblins/`)
  }
}
