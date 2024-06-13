import { ActionRowBuilder, APIEmbedField, ApplicationCommandOptionType, ApplicationCommandType, ButtonBuilder, ButtonStyle, CacheType, Collection, CollectorFilter, ComponentType, DiscordjsError, DiscordjsErrorCodes, EmbedBuilder, ModalActionRowComponentBuilder, ModalBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction, StringSelectMenuOptionBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Command, CommandProps } from "../../structs/types/Command";
import { Goblin } from "../../engine/GoblinEngine";
import { randomInt, Range } from "../../utils/math";
import logger from "../../utils/logger";
import { diceToEmoji } from "../../utils/dice";

type runCommandFunc = (props: CommandProps) => Promise<void>

const commandSobre: runCommandFunc = async ({ interaction }) => {

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

const runningCommands: string[] = []

const commandMagia: runCommandFunc = async ({ interaction, options }) => {
    const tipoMagia = options.getString("tipo-magia", true)

    const magia = Goblin.getMagic(tipoMagia)

    if (magia) {
        const hits = ["0", "1", "2", "3+"]
        const text = magia.values.map((v, index) => `- **${hits[index]} hit:** ${v}`).join("\n")
        interaction.reply({
            content: `### Magia de ${magia.emoji} ${magia.title}:\n${text}`,
            ephemeral: true
        })
    }
}

const createEmbbedFromGoblin = (goblin: Goblin): EmbedBuilder => {
    const fields: APIEmbedField[] = [
        { name: "Nome:", value: goblin.nome, inline: true },
        { name: "Ocupação:", value: goblin.ocupation.title, inline: true },
        { name: "Descritor:", value: goblin.descritor.title, inline: true },
        { name: goblin.caracteristica.title, value: goblin.caracteristica.description },
        ...[
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
        ].map((v) => ({ name: `${v.icon} ${v.name}`, value: v.value.toString(), inline: true })),
        {
            name: "Técnicas:",
            value: goblin.ocupation.skills.map<string>((v, index) => `- **Level ${index + 1} - ${v.title}**: ${v.description}`).join("\n")
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
            value: "use o comando `/malditos-goblins roll-magia <tipo-magia> <dado-nocao>` para saber o resultado, boa sorte!"
        })
    }


    const goblinEmb = new EmbedBuilder()
        .addFields(...fields)
        .setThumbnail(`https://raw.githubusercontent.com/antomarsi/malditos-goblins-discordjs/version-2/src/imgs/${goblin.ocupation.value}.png`)
        .setTimestamp()

    return goblinEmb
}

const commandCreateGoblin: runCommandFunc = async ({ interaction, options }) => {
    const charac = Goblin.generateCharacteristic()
    const ocupation = Goblin.generateOcupation()
    const descritor = Goblin.generateDescritor()

    let goblinName = options.getString("nome") ?? Goblin.generateName()
    if (["Ultima coisa que vc comeu", "Inverta seu nome"].includes(goblinName)) {
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
            logger.error(error)
            return null
        })

        if (!modalInteraction) {
            console.error("Você não informou um nome no periodo de 30 segundos, tente novamente.")
            return;
        }
        goblinName = modalInteraction.fields.getTextInputValue("goblin-name")
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
            label: equipDescription,
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


    const weaponMsg = await interaction.followUp({
        content: `Seu goblin se chama **${goblinName}**, será um **${ocupation.title}**, selecione seu equipamento:`,
        components: [weaponSelectRow],
        ephemeral: true,
        fetchReply: true
    })

    let equipSelected
    let collectorWeapon
    try {
        collectorWeapon = await weaponMsg.awaitMessageComponent({ filter: collectorFilter, componentType: ComponentType.StringSelect, time: 30_000 });
        equipSelected = Number(collectorWeapon.values[0])
        await collectorWeapon.deleteReply()
    } catch (err) {
        if (err instanceof DiscordjsError && err.code == DiscordjsErrorCodes.InteractionCollectorError) {
            console.error(`User ${interaction.user.id} didn't selected a weapon: ${err}`)
            await collectorWeapon?.deleteReply()
            return;
        } else {
            throw err
        }
    }

    if (descritor.choose) {

        const descritorSelectRow = new ActionRowBuilder<StringSelectMenuBuilder>({
            components: [
                new StringSelectMenuBuilder({
                    customId: "descritor-select",
                    placeholder: "Selecione um atributo",
                }).setOptions([
                    {
                        emoji: '⚔️',
                        label: 'Combate',
                        value: "combate"
                    },
                    {
                        emoji: '🏃',
                        label: 'Habilidade',
                        value: "habilidade"
                    },
                    {
                        emoji: '❤️',
                        label: 'Vitalidade',
                        value: "vitalidade"
                    },
                    {
                        emoji: '📚',
                        label: 'Noção',
                        value: "nocao"
                    }
                ])
            ]
        })

        const descritorMsg = await interaction.followUp({
            content: `Seu goblin é supimpa, escolha um atributo para ganhar +1:`,
            components: [descritorSelectRow],
            ephemeral: true,
            fetchReply: true
        })

        let collectorDescritor
        try {
            collectorDescritor = await descritorMsg.awaitMessageComponent({ filter: collectorFilter, componentType: ComponentType.StringSelect, time: 30_000 });
            const descritorSelect = collectorDescritor.values[0] as "combate" | "habilidade" | "nocao" | "vitalidade"
            descritor.stats[descritorSelect] = 1
            await collectorDescritor?.deleteReply()
        } catch (err) {
            if (err instanceof DiscordjsError && err.code == DiscordjsErrorCodes.InteractionCollectorError) {
                console.error(`User ${interaction.user.id} didn't selected a atribute: ${err}`)
                await collectorDescritor?.deleteReply()
                return;
            } else {
                throw err
            }
        }
    }

    let magics
    if (ocupation.useMagic) {
        const magicOptions: StringSelectMenuOptionBuilder[] = Goblin.getMagics().map<StringSelectMenuOptionBuilder>(v => new StringSelectMenuOptionBuilder({ label: v.title, value: v.value, emoji: v.emoji }))

        const magicMsg = await interaction.followUp({
            content: `Como você é ${ocupation.title}, selecione 3 magias:`,
            ephemeral: true,
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
        try {

            const collectorMagic = await magicMsg.awaitMessageComponent({ filter: collectorFilter, componentType: ComponentType.StringSelect, time: 30_000 });
            if (collectorMagic.values.length != 3) {
                throw new Error("Deu pau quando vc era pra escolher 3 magias 😢, tente novamente.")
            }
            await collectorMagic.deleteReply()
            magics = collectorMagic.values
        } catch (err) {
            if (err instanceof DiscordjsError && err.code == DiscordjsErrorCodes.InteractionCollectorError) {
                console.error(`User ${interaction.user.id} didn't selected a weapon: ${err}`)
                await magicMsg.delete()
                return;
            } else {
                throw err
            }
        }
    }

    const goblin = new Goblin(goblinName, ocupation, descritor, charac, equipSelected, magics)
    const embed = createEmbbedFromGoblin(goblin)
    const user = `<@${interaction.user.id}>`
    interaction.followUp({
        content: `${user} criou o seguinte goblin:`,
        embeds: [embed]
    })
}

const commandRoll: runCommandFunc = async ({ interaction, options }) => {
    const numeroDados = options.getInteger("dados")
    if (!numeroDados || numeroDados <= 0) {
        throw new Error("Valor invalido pra jogar os dados")
    }
    const dadosResultado = Range(1, numeroDados).map(() => diceToEmoji(randomInt(0, 5))).join(" ")
    interaction.reply({
        content: `<@${interaction.user.id}> rolou ${numeroDados}d6 com o resultado: ${dadosResultado}`
    })
}

const commandRollMagia: runCommandFunc = async ({ interaction, options }) => {
    const numeroDados = options.getInteger("dado-nocao")
    if (!numeroDados || numeroDados <= 0) {
        throw new Error("Valor invalido pra jogar os dados")
    }

    const dadoMagia = options.getString("tipo-magia")
    if (!dadoMagia) {
        throw new Error("Magia inválida");
    }
    const dados = Range(1, numeroDados).map(() => randomInt(1, 6))

    const hits = dados.reduce((acc, cur) => {
        return acc + (cur >= 4 ? 1 : 0);
    }, 0)
    const magia = Goblin.getMagicDice(dadoMagia, numeroDados)
    if (magia == undefined) {
        throw new Error("Essa magia não existe, tente novamente")
    } else {
        interaction.reply({
            content: `<@${interaction.user.id}> rolou **${numeroDados}d6** com o resultado: ${dados.map(v => diceToEmoji(v - 1)).join(" ")}\n Obteve **${hits} acertos** e a magia de ${magia.title} resultou em:\n**${magia.description}**`
        })
    }

    return;

};


const commandEquips: runCommandFunc = async ({ interaction, options }) => {
    const tipoEquipamento = options.getString("tipo-equip", true)

    if (["armas", "protecao", "outros"].includes(tipoEquipamento)) {
        const equips = Goblin.getAllEquipsByType(tipoEquipamento as "armas" | "protecao" | "outros")
        let text = equips.items.join("\n")
        if (equips.specials.length > 0) {
            text += `\n ------------------------- \n**Especiais:**\n${equips.specials.join("\n")}`
        }
        interaction.reply({
            content: `### Items do tipo ${tipoEquipamento}:\n\n${text}`,
            ephemeral: true
        })
    } else {
        interaction.reply({
            content: `Tipo de equipamento inválido`,
            ephemeral: true
        })
    }
}

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
                    description: "Número de dados",
                    type: ApplicationCommandOptionType.Integer,
                    required: true
                }
            ]
        },
        {
            name: "roll-magia",
            description: "Joga seus dados, para testar sua magia",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "tipo-magia",
                    description: "Qual o tipo de magia",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    autocomplete: true,
                },
                {
                    name: "dado-nocao",
                    description: "O seu valor de noção",
                    type: ApplicationCommandOptionType.Integer,
                    required: true
                },
            ]
        },
        {
            name: "magia",
            description: "Mostra a lista de magias",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "tipo-magia",
                    description: "Lista de magias",
                    type: ApplicationCommandOptionType.String,
                    choices: Goblin.getMagics().map(v => ({ name: v.title, value: v.value, }))
                }
            ]
        },
        {
            name: "equips",
            description: "Aqui você encontra todos equipamentos e qualquer outro que os goblins podem encontrar.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "tipo-equip",
                    description: "Lista de itens diversos",
                    type: ApplicationCommandOptionType.String,
                    choices: [
                        { name: "Armas", value: "armas" },
                        { name: "Proteção", value: "protecao" },
                        { name: "Outros", value: "Outros" },
                    ]
                }
            ]
        }
    ],
    async autoComplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);
        let choices: { name: string, value: string }[] = []
        if (focusedOption.name == "tipo-magia") {
            choices = Goblin.getMagics().map(v => ({ name: v.title, value: v.value }))
        }
        const value = focusedOption.value.toLocaleLowerCase()
        const filtered = choices.filter(choice => choice.name.toLocaleLowerCase().startsWith(value) || choice.value.toLocaleLowerCase().startsWith(value))
        await interaction.respond(
            filtered
        )
    },
    async run(props) {
        const { interaction, options } = props

        const subCommand = options.getSubcommand(true)

        const id = `${interaction.user.id}_${interaction.guildId}`
        switch (subCommand) {
            case "criar":
                if (runningCommands.includes(id)) {
                    await interaction.reply({ content: "Comando já está sendo executado.", ephemeral: true })
                } else {
                    runningCommands.push(id)
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
                    const index = runningCommands.indexOf(id)
                    runningCommands.splice(index, 1)
                }
                break;
            case "sobre":
                await commandSobre(props)
                break;
            case "magia":
                await commandMagia(props)
                break
            case "roll":
                await commandRoll(props)
                break;
            case "roll-magia":
                await commandRollMagia(props)
                break;
            case "equips":
                await commandEquips(props)
                break;
            default:
                logger.warn(`User <${interaction.user.id}> selected "${subCommand}" which is not a command.`)
                break;
        }
    }
})

