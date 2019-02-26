import { Message } from 'discord.js';

export interface ICommand {
  process(msg: Message): boolean;
  getHelp(): void;
}


export interface Ocupacao {
  nome: string;
  combate: number;
  conhecimento: number;
  habilidade: number;
  sorte: number;
}
