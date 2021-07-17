import { EmbedFieldData, Message, MessageEmbed } from 'discord.js'
import createGoblin from './newGoblin'
import knowMore from './knowMore'
import roll from './roll'

const prefix = process.env.PREFIX || '~goblin'

export interface ICommand {
  name: string
  description: string
  execute: (message: Message, args: string[]) => void
}

const commands: ICommand[] = [createGoblin, knowMore, roll]

const help: ICommand = {
  name: 'ajuda',
  description: 'Mostra a lista de comandos',
  execute: (msg, args) => {
    const embedFields: EmbedFieldData[] = commands.map(value => ({
      name: `${prefix} ${value.name}`,
      value: value.description
    }))

    const message = new MessageEmbed()
      .setColor('#42b983')
      .setTitle('Ajuda')
      .setDescription('Tá ai uma lista batuta de comandos:')
      .addFields(...embedFields)
    msg.channel.send(message)
  }
}
commands.push(help)

export default commands
