import { IOcupacao } from "./Ocupacao";
import { IColoracao } from "./Coloracao";
import { ICaracteristica } from "./Caracteristica";
export default class Goblin {
    ocupacao: IOcupacao;
    coloracao: IColoracao;
    caracteristica: ICaracteristica;
    equipamentos: string[];
    nome: string;
    constructor(nome?: string);
    private generateName;
    readonly combate: Number;
    readonly conhecimento: Number;
    readonly habilidade: Number;
    readonly sorte: Number;
}
