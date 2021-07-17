import { getRandomOcupacao, IOcupacao } from "./Ocupacao";
import { getRandomColoracao, IColoracao } from "./Coloracao";
import { getRandomCaracteristica, ICaracteristica } from "./Caracteristica";

export default class Goblin {
  public ocupacao: IOcupacao;
  public coloracao: IColoracao;
  public caracteristica: ICaracteristica;
  public equipamentos: string[];
  public nome: string;

  constructor() {
  }

  public static generateGoblin(name?:string) {
    const goblin = new Goblin();
    goblin.nome = name || goblin.generateName();
    goblin.ocupacao = getRandomOcupacao();
    goblin.coloracao = getRandomColoracao();
    goblin.caracteristica = getRandomCaracteristica();
    return goblin
  }

  public generateName(): string {
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
