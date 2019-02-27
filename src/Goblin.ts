import { IOcupacao, IColoracao, ICaracteristica } from "./Interfaces";
import { getRandomOcupacao } from "./GoblinData/Ocupacao";
import { getRandomColoracao } from "./GoblinData/Coloracao";
import { getRandomCaracteristica } from "./GoblinData/Caracteristica";

export default class Goblin {
  public ocupacao: IOcupacao;
  public coloracao: IColoracao;
  public caracteristica: ICaracteristica;
  public equipamentos: string[];
  public nome: string;

  constructor(nome?: string) {
    if (nome) {
      this.nome = nome;
    } else {
      this.nome = this.generateName();
    }
    this.ocupacao = getRandomOcupacao();
    this.coloracao = getRandomColoracao();
    this.caracteristica = getRandomCaracteristica();
  }

  private generateName(): string {
    let prefix = ["Sp", "Cr", "Bu", "Ut", "An", "Om"];
    let sufix = ["or", "ut", "ar", "an", "an", "ec"];
    return (
      prefix[Math.floor(Math.random() * prefix.length)] +
      sufix[Math.floor(Math.random() * sufix.length)]
    );
  }

  get combate(): Number {
    return this.ocupacao.combate + this.coloracao.combate;
  }

  get conhecimento(): Number {
    return this.ocupacao.conhecimento + this.coloracao.conhecimento;
  }

  get habilidade(): Number {
    return this.ocupacao.habilidade + this.coloracao.habilidade;
  }

  get sorte(): Number {
    return this.ocupacao.sorte + this.coloracao.sorte;
  }
}
