import { Message } from 'discord.js'
import { ICommand } from './index'
const name = 'saiba-mais'

const description = 'Envia em privado o link para o site do CoisinhaVerde =D'

const execute = (msg: Message, args: string[]) => {
  msg.author.send(
    'Você é bem bacana em querer saber mais sobre o criador de Malditos Goblins =D\nAqui está o site: http://www.coisinhaverde.com.br/'
  )
}

const knowMore: ICommand = { name, description, execute }

export default knowMore
