import { Message } from 'discord.js'
import { ICommand } from './index'
import { randomInt } from './../utils/math'
const name = 'dado'

const description = 'Rola N dados limite de 6. Use o comando: dado <N>'

const execute = (msg: Message, args: string[]) => {
  if (
    args.length <= 0 ||
    !Number(args[0]) ||
    Number(args[0]) > 6 ||
    Number(args[0]) <= 0
  ) {
    msg.channel.send('informe o numero de dados para rolar (limite de 6)')
    return
  }
  const numeroDados = Number(args[0])
  const dados: number[] = []
  for (let index = 0; index < numeroDados; index++) {
    dados.push(randomInt(1, 6))
  }
  const dadosString = dados.join(', ')
  const exploded = dados.every(value => value === 1)

  msg.channel.send(
    `${msg.author} rolou ${numeroDados} dados: [${dadosString}].` +
      (exploded
        ? ' Todos os dados são 1, seu goblin explodiu! (em milhões de pedacinhos)'
        : '')
  )
}

const roll: ICommand = { name, description, execute }

export default roll
