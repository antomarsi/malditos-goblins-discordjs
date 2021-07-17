import { Message, MessageEmbed, User } from 'discord.js'
import Goblin from '../Goblin/index'
import { ICommand } from './index'
const name = 'novo'

const description = 'Cria um novo goblin'

const formatMessageNewGoblin = (
  goblin: Goblin,
  author: User
): MessageEmbed => {
  const message = new MessageEmbed()
  message.setTitle(`Uma nova *Coisinha Verde©* (ou de outra cor) foi criada`)
  message.setAuthor(author.username)
  message.setColor(goblin.coloracao.cor)
  message.addFields(
    { name: 'Nome gerado:', value: goblin.nome, inline: true },
    { name: 'Ocupação:', value: goblin.ocupacao.nome, inline: true },
    { name: 'Coloração:', value: goblin.coloracao.nome, inline: true },
    { name: 'Caracteristica:', value: goblin.caracteristica.toString() }
  )
  message.addField(':crossed_swords: Combate', goblin.combate, true)
  message.addField(':man_running: Habilidade', goblin.habilidade, true)
  message.addField(':books: Conhecimento', goblin.conhecimento, true)
  message.addField(':four_leaf_clover: Sorte', goblin.sorte, true)

  goblin.ocupacao.habilidades.forEach((hab, index) => {
    message.addField(`Level ${index + 1} - ${hab.nome}`, hab.descricao)
  })
  message.addField(`Equipamentos iniciais:`, goblin.ocupacao.equipamento)
  return message
}

const execute = (msg: Message, args: string[]) => {
  const goblin = Goblin.generateGoblin()
  const message = formatMessageNewGoblin(goblin, msg.author)
  msg.channel.send(message)
}

const createGoblin: ICommand = { name, description, execute }

export default createGoblin
