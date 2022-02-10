import { SlashCommand, SlashCreator, CommandContext } from 'slash-create';

export default class HelloCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'goblin-sobre',
      description: 'Saiba mais sobre "Malditos Goblins".'
    });
  }

  async run(ctx: CommandContext) {
    await ctx.defer(true);

    await ctx.send({
      embeds: [
        {
          title: 'Você é bem bacana em querer saber mais sobre este bot.',
          description: 'Este é um bot criado para que todos que querem se divertir com este jogo divertido.',
          fields: [
            {
              name: 'Sobre o criador',
              value:
                'Me chamo AntonioMarco (antomarsi) e gosto de programar no meu tempo vago. Este Bot é uma dessas coisas que eu criei, espero que gostem'
            },
            {
              name: 'Malditos Goblins',
              value: [
                'Malditos Goblins é um mini RPG de humor.',
                'Neste jogo os jogadores interpretam goblins fracotes que morrem por qualquer coisa!',
                'Os personagens começam com suas características roladas aleatoriamente e já estão prontos para jogar!',
                'Provavelmente ele morrerá na segunda ou terceira batalha. Então você gera outro goblin e continua o jogo!',
                'Basta dizer que é um irmão, filho, sobrinho, etc que veio se vingar!',
                'Se quer saber mais sobre Malditos goblins, clique aqui:\nhttps://coisinhaverde.com.br/jogos/portfolio/malditos-goblins/'
              ].join('\n')
            },
            {
              name: 'Sobre o BOT',
              value:
                'É um bot simples e também de código-aberto, você pode acessar:\nhttps://github.com/antomarsi/malditos-goblins-discordjs\nCaso queira ajudar ou caso houver algum problema'
            }
          ]
        }
      ]
    });
  }
}
