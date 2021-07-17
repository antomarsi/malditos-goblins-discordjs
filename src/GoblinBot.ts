import * as Discord from 'discord.js'
import { Logger } from 'tslog'
import commands, { ICommand } from './Commands'

export class GoblinBot {
  private client: Discord.Client
  private botId: string
  private commands: Discord.Collection<string, ICommand>
  private prefix: string = process.env.PREFIX || "~goblin"
  private logger: Logger

  constructor(logger?: Logger) {
    this.client = new Discord.Client()
    this.commands = new Discord.Collection()

    this.logger = logger || new Logger({ name: 'Malditos Goblins Bot' })
    this.loadCommands()
    this.setUpEvents()
  }

  private loadCommands(): void {
    commands.forEach(command => {
      this.commands.set(command.name, command)
    })
  }

  private setUpEvents(): void {
    this.client.on('ready', async () => {
      this.botId = this.client.user!.id
      this.logger.info(`Bot Connected.`)
      this.logger.info(`Logged in as ${this.client.user!.tag}`)
      this.client.user!.setActivity(`Use ${this.prefix} ajuda`)
      console.log('Bot Connected.')
    })

    this.client.on('message', async (message: Discord.Message): Promise<void> => {
      if (!message.content.startsWith(this.prefix) || message.author.bot) return
      const args = message.content.slice(this.prefix.length).trim().split(/ +/)
      const command = args.shift()?.toLowerCase()
      if (command === undefined) {
        return
      }

      if (!this.commands.has(command)) return
      try {
        this.commands.get(command)?.execute(message, args)
      } catch (err) {
        this.logger.error(err)
        message.reply(`Ocorreu um erro executando o comando "${command}"`)
      }
    })

    this.client.on('error', this.logger.error)

    this.client.on('warn', this.logger.warn)

    process.on('exit', () => {
      this.logger.info(`Bot Process exit.`)
      this.client.destroy()
    })

    process.on('uncaughtException', (err: Error) => {
      const errorMsg = (err ? err.stack || err : '')
        .toString()
        .replace(new RegExp(`${__dirname}\/`, 'g'), './')
      this.logger.error(errorMsg)
    })
  }

  public start(token: string): void {
    this.logger.info('Starting bot...')
    this.client.login(token)
  }
}
