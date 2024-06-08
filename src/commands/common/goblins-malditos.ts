import { ActionRowBuilder, APIEmbedField, ApplicationCommandOptionType, ApplicationCommandType, ButtonBuilder, ButtonStyle, CacheType, Collection, CollectorFilter, ComponentType, EmbedBuilder, ModalActionRowComponentBuilder, ModalBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction, StringSelectMenuOptionBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Command, CommandProps } from "../../structs/types/Command";
import { Goblin } from "../../engine/GoblinEngine";
import { randomInt, Range } from "../../utils/math";

type runCommandFunc = (props: CommandProps) => Promise<void>

const commandSobre: runCommandFunc = async ({ interaction, options }) => {

    const sobreEmbed = new EmbedBuilder()
        .setTitle("Você é bem bacana em querer saber mais sobre este bot.")
        .setDescription("Este é um bot criado para que todos que querem se divertir com este jogo divertido.")
        .setFields(
            {
                name: 'Sobre o criador',
                value:
                    'Me chamo Antonio Marco (antomarsi) e gosto de programar no meu tempo vago. Este Bot é uma dessas coisas que eu criei, espero que gostem'
            },
            {
                name: 'Malditos Goblins',
                value: [
                    'Malditos Goblins é um mini RPG de humor.',
                    'Neste jogo os jogadores interpretam goblins fracotes que morrem por qualquer coisa!',
                    'Os personagens começam com suas características roladas aleatoriamente e já estão prontos para jogar!',
                    'Provavelmente ele morrerá na segunda ou terceira batalha. Então você gera outro goblin e continua o jogo!',
                    'Basta dizer que é um irmão, filho, sobrinho, etc que veio se vingar!',
                    'Se quer saber mais sobre Malditos goblins, clique aqui no botão "Quero saber mais!" abaixo'
                ].join('\n'),
            },
            {
                name: "Arte",
                value: "Toda arte vem do Manual oficial do Malditos Goblins, criado por Bruno Henrique Junges"
            },
            {
                name: 'Sobre o BOT',
                value:
                    'É um bot simples e também de código-aberto, caso queira ajudar ou caso houver algum problema, podes clicar no botão "Gihub" abaixo'
            }
        )
    const row = new ActionRowBuilder<ButtonBuilder>({
        components: [
            new ButtonBuilder({ url: "https://coisinhaverde.com.br/jogos/portfolio/malditos-goblins/", label: "Quero saber mais!", style: ButtonStyle.Link }),
            new ButtonBuilder({ url: "https://github.com/antomarsi/malditos-goblins-discordjs", label: "Github", style: ButtonStyle.Link })
        ]
    })
    await interaction.reply({ embeds: [sobreEmbed], components: [row], ephemeral: true })
}

const createEmbbedFromGoblin = (goblin: Goblin): EmbedBuilder => {
    let fields: APIEmbedField[] = [
        { name: "Nome:", value: goblin.nome, inline: true },
        { name: "Ocupação:", value: goblin.ocupation.title, inline: true },
        { name: "Descritor:", value: goblin.descritor.title, inline: true },
        { name: goblin.caracteristica.title, value: goblin.caracteristica.description },
        {
            name: "Status:",
            value: [
                {
                    icon: '⚔️',
                    name: 'Combate',
                    value: goblin.combate
                },
                {
                    icon: '🏃',
                    name: 'Habilidade',
                    value: goblin.habilidade
                },
                {
                    icon: '❤️',
                    name: 'Vitalidade',
                    value: goblin.vitalidade
                },
                {
                    icon: '📚',
                    name: 'Noção',
                    value: goblin.nocao
                }
            ].map<string>((v) => `${v.icon} ${v.name}: ${v.value}`).join("\n")
        },
        {
            name: "Técnicas:",
            value: goblin.ocupation.skills.map<string>((v, index) => `**Level ${index + 1} - ${v.title}**: ${v.description}`).join("\n")
        }
    ]


    fields.push({
        name: "Equipamentos iniciais:",
        value: goblin.equipamentos
    })

    if (goblin.hasMagic) {
        fields.push({
            name: "Magias:",
            value: goblin.magics.join(", ")
        })
        fields.push({
            name: "Você é um bruxo, então só pra lembrar:",
            value: "use o comando **/malditos-goblins roll <numero-de-dados> <tipo-da-magia>** para saber o resultado, boa sorte!"
        })
    }


    const goblinEmb = new EmbedBuilder()
        .addFields(...fields)
        .setThumbnail(`https://raw.githubusercontent.com/antomarsi/malditos-goblins-discordjs/version-2/src/imgs/${goblin.ocupation.value}.png`)

    return goblinEmb
}

const commandCreateGoblin: runCommandFunc = async ({ interaction, options }) => {

    const charac = Goblin.generateCharacteristic()
    const ocupation = Goblin.generateOcupation()
    const descritor = Goblin.generateDescritor()

    let goblinName = options.getString("nome") ?? Goblin.generateName()
    if (["Ultima coisa que vc comeu", "Inverta seu nome"].includes(goblinName)) {
        console.debug("Chamando modal de nome")
        const modal = new ModalBuilder({ customId: "modal-goblin-name", title: "Criador de Goblin" })
        const nameRow = new ActionRowBuilder<ModalActionRowComponentBuilder>({
            components: [
                new TextInputBuilder({
                    custom_id: "goblin-name",
                    label: goblinName,
                    style: TextInputStyle.Short,
                    min_length: 3,
                    max_length: 32,
                    required: true
                })
            ]
        });

        modal.setComponents(nameRow)
        await interaction.showModal(modal);

        const modalInteraction = await interaction.awaitModalSubmit({
            time: 30_000, filter: i => {
                i.deferUpdate()
                return i.user.id === interaction.user.id
            }
        }).catch(error => {
            console.log(error)
            return null
        })

        if (!modalInteraction) {
            console.error("Você não informou um nome no periodo de 30 segundos, tente novamente.")
            return;
        }
        goblinName = modalInteraction.fields.getTextInputValue("goblin-name")
        console.debug(`finalizado modal, o nome do goblin é ${goblinName}`)
    } else {
        await interaction.deferReply({ ephemeral: true })
    }

    const collectorFilter: CollectorFilter<[StringSelectMenuInteraction<CacheType>, Collection<string, StringSelectMenuInteraction<CacheType>>]> = i => {
        i.deferUpdate()
        return i.user.id === interaction.user.id;
    }

    const equipOptions: StringSelectMenuOptionBuilder[] = ocupation.equipamentos.map<StringSelectMenuOptionBuilder>((v, index) => {
        const equipDescription = Goblin.getEquipsDescription(v)
        return new StringSelectMenuOptionBuilder({
            label: equipDescription.title,
            description: equipDescription.description,
            value: index.toString()
        })
    })

    const weaponSelectRow = new ActionRowBuilder<StringSelectMenuBuilder>({
        components: [
            new StringSelectMenuBuilder({
                customId: "weapon-select",
                placeholder: "Selecione seu Equipamento",
            }).setOptions(equipOptions)
        ]
    })

    console.debug(`Seu goblin chamado ${goblinName}, será um ${ocupation.title}, selecione seu equipamento:`)
    const weaponMsg = await interaction.followUp({
        content: `Seu chamado ${goblinName}, será um ${ocupation.title}, selecione seu equipamento:`,
        components: [weaponSelectRow],
        ephemeral: true,
        fetchReply: true
    })

    let equipSelected
    try {
        const collectorWeapon = await weaponMsg.awaitMessageComponent({ filter: collectorFilter, componentType: ComponentType.StringSelect, time: 30_000 });
        equipSelected = Number(collectorWeapon.values[0])
    } catch (err) {
        throw new Error(`User didn't selected a weapon: ${err}`)
    }

    let magics
    if (ocupation.useMagic) {
        const magicOptions: StringSelectMenuOptionBuilder[] = Goblin.getMagics().map<StringSelectMenuOptionBuilder>(v => new StringSelectMenuOptionBuilder({ label: v.title, value: v.value, emoji: v.emoji }))

        const magicMsg = await interaction.followUp({
            content: `Como você é ${ocupation.title}, selecione 3 magias:`,
            components: [new ActionRowBuilder<StringSelectMenuBuilder>({
                components: [
                    new StringSelectMenuBuilder({
                        customId: `magic-select`,
                        placeholder: `Selecione 3 magicas`
                    }).setOptions(magicOptions)
                        .setMinValues(3)
                        .setMaxValues(3)
                ]
            })]
        })

        const collectorMagic = await magicMsg.awaitMessageComponent({ filter: collectorFilter, componentType: ComponentType.StringSelect, time: 60_000 });
        if (collectorMagic.values.length != 3) {
            throw new Error("Deu pau quando vc era pra escolher 3 magias 😢, tente novamente.")
        }
        magics = collectorMagic.values
    }

    const goblin = new Goblin(goblinName, ocupation, descritor, charac, equipSelected, magics)

    interaction.followUp({
        content: `<@${interaction.user.id}> criou o seguinte goblin:`,
        embeds: [createEmbbedFromGoblin(goblin)]
    })
}

const commandRoll: runCommandFunc = async ({ interaction, options }) => {
    const numeroDados = options.getInteger("dados")
    if (!numeroDados || numeroDados <= 0) {
        throw new Error("Valor invalido pra jogar os dados")
    }

    const dadoMagia = options.getString("dado-magia")
    if (!dadoMagia) {
        throw new Error("Tipo de magia não especificado")
    }
    if (dadoMagia) {
        const hits = Range(1, numeroDados).reduce((acc, cur) => {
            return acc + (cur >= 4 ? 1 : 0);
        }, 0)
        const magia = Goblin.getMagicDice(dadoMagia, numeroDados)
        if (magia == undefined) {
            throw new Error("Essa magia não existe, tente novamente")
        } else {
            interaction.reply({
                content: `<@${interaction.user.id}> com ${hits} acertos, a magia ${magia.title} resultou em:\n:${magia.description}`
            })
        }

        return;
    } else {
        interaction.reply({
            content: `<@${interaction.user.id}> rolou ${numeroDados} dados com o resultado\n:
            Resultado: ${Range(1, numeroDados).map(v => randomInt(1, 6)).reduce<string[]>((acc, cur) => {
                acc.push(randomInt(1, 6).toString())
                return acc
            }, []).join(", ")}`
        })
    }
};

export default new Command({
    name: "malditos-goblins",
    description: "Gerenciador do bot Malditos Goblins",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "criar",
            description: "Cria um novo goblin",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "nome",
                    description: "Nome do goblin (Opcional)",
                    type: ApplicationCommandOptionType.String
                }
            ]
        },
        {
            name: "sobre",
            description: "Saiba mais sobre o bot",
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: "roll",
            description: "Joga seus dados, boa sorte",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "dados",
                    description: "Número de dados, se for magia, é o seu valor de noção",
                    type: ApplicationCommandOptionType.Integer,
                    required: true
                },
                {
                    name: "dado-magia",
                    description: "Qual o tipo de magia",
                    type: ApplicationCommandOptionType.String
                }
            ]
        }
    ],
    async run(props) {
        const { interaction, options } = props

        const subCommand = options.getSubcommand(true)

        switch (subCommand) {
            case "criar":
                try {
                    await commandCreateGoblin(props)
                } catch (error) {
                    console.error(error)
                    if (interaction.replied) {
                        await interaction.editReply({ content: "Algum erro ocorreu, mals" })
                    } else if (!interaction.replied) {
                        await interaction.reply({ content: "Algum erro ocorreu, mals", ephemeral: true })
                    }
                }
                break;

            case "sobre":
                await commandSobre(props)
                break;

            case "roll":
                await commandRoll(props)
                break;

            default:
                console.log("Nenhum commando selectionado")
                break;
        }
    }
})

