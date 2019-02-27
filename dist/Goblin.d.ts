import { IOcupacao, IColoracao, ICaracteristica } from './Interfaces';
export default class Goblin {
    ocupacao: IOcupacao;
    coloracao: IColoracao;
    caracteristica: ICaracteristica;
    equipamentos: string[];
    constructor(name?: string);
    readonly combate: Number;
    readonly conhecimento: Number;
    readonly habilidade: Number;
    readonly sorte: Number;
}
