import { getRandomOcupacao, IOcupacao } from './Ocupacao';
import { getRandomColoracao, IColoracao } from './Coloracao';
import { getRandomCaracteristica, ICaracteristica } from './Caracteristica';
import { randomInt } from '../utils/math';

export default class Goblin {
  public ocupacao: IOcupacao;
  public coloracao: IColoracao;
  public caracteristica: ICaracteristica;
  public nome: string;

  constructor(name?:string ) {
    this.nome = name || this.generateName();
    this.ocupacao = getRandomOcupacao();
    this.coloracao = getRandomColoracao();
    this.caracteristica = getRandomCaracteristica();
  }

  public static generateGoblin(name?: string) {
    const goblin = new Goblin();

    return goblin;
  }

  public generateName(): string {
    let prefix = ['Sp', 'Cr', 'Bu', 'Ut', 'An', 'Om'];
    let sufix = ['or', 'ut', 'ar', 'an', 'an', 'ec'];
    return prefix[randomInt(0, prefix.length - 1)] + sufix[randomInt(0, sufix.length - 1)];
  }

  get combate(): number {
    return this.ocupacao.combate + this.coloracao.combate;
  }

  get conhecimento(): number {
    return this.ocupacao.conhecimento + this.coloracao.conhecimento;
  }

  get habilidade(): number {
    return this.ocupacao.habilidade + this.coloracao.habilidade;
  }

  get sorte(): number {
    return this.ocupacao.sorte + this.coloracao.sorte;
  }

  get cor(): number {
    return parseInt(this.coloracao.cor.replace("#", ""), 16)
  }
}
