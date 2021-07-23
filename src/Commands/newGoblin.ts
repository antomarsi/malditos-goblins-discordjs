import { Message, MessageEmbed, User } from 'discord.js'
import MalditosGoblins from 'malditos-goblins-lib'
import { ICommand } from './index'
const name = 'novo'

const description = 'Cria um novo goblin'

const formatMessageNewGoblin = (
  goblin: MalditosGoblins.Goblin,
  author: User
): MessageEmbed => {

  const specialFeature = `${goblin.specialFeature.name} - ${goblin.specialFeature.description}` + goblin.specialFeature.extraDescriptions ? `(${goblin.specialFeature.extraDescriptions?.join(", ")})` : ""
  const message = new MessageEmbed()
  message.setTitle(`Uma nova *Coisinha Verde©* (ou de outra cor) foi criada`)
  message.setAuthor(author.username)
  message.setColor(goblin.coloration.color)
  message.addFields(
    { name: 'Nome gerado:', value: MalditosGoblins.generateName(), inline: true },
    { name: 'Ocupação:', value: goblin.ocupation.name, inline: true },
    { name: 'Coloração:', value: goblin.coloration.name, inline: true },
    { name: 'Caracteristica:', value: specialFeature }
  )
  message.addField(':crossed_swords: Combate', goblin.combat, true)
  message.addField(':man_running: Habilidade', goblin.dexterity, true)
  message.addField(':books: Conhecimento', goblin.knowledge, true)
  message.addField(':four_leaf_clover: Sorte', goblin.luck, true)

  goblin.ocupation.skills.forEach((skill, index) => {
    message.addField(`Level ${index + 1} - ${skill.name}`, skill.description)
  })
  message.addField(`Equipamentos iniciais:`, goblin.equipments.map(equip => equip.toString()).join("\n"))
  return message
}

const execute = (msg: Message, args: string[]) => {
  const goblin = MalditosGoblins.generateGoblin()
  const message = formatMessageNewGoblin(goblin, msg.author)
  msg.channel.send(message)
}

const createGoblin: ICommand = { name, description, execute }

export default createGoblin
