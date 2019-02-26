import { Message } from "discord.js";

export interface ICommand {
  process(msg: Message): boolean;
  getHelp(): void;
}

export interface IOcupacao {
  nome: string;
  combate: number;
  conhecimento: number;
  habilidade: number;
  sorte: number;
  habilidades: string[];
  equipamento: IEquipamentos;
}

export interface IColoracao {
  nome: string;
  combate: number;
  conhecimento: number;
  habilidade: number;
  sorte: number;
}

export interface ICaracteristica {
  nome: string;
  descricao: string;
  toString(): string;
}

export interface IHabilidade {
  nome: string;
  descricao: string;

  toString(): string;
}

export interface IEquipamentos {
  equipamentos: string[];
  getRandomEquipamento(): string;
}