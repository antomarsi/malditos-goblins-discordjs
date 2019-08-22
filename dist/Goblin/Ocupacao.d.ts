export interface IOcupacao {
    nome: string;
    combate: number;
    conhecimento: number;
    habilidade: number;
    sorte: number;
    habilidades: any[];
    equipamento: string;
}
declare class Ocupacao implements IOcupacao {
    nome: string;
    combate: number;
    conhecimento: number;
    habilidade: number;
    sorte: number;
    habilidades: any[];
    equipType: number;
    readonly equipamento: string;
}
export declare class Mercenario extends Ocupacao {
    nome: string;
    combate: number;
    conhecimento: number;
    habilidade: number;
    sorte: number;
    habilidades: {
        nome: string;
        descricao: string;
    }[];
    equipType: number;
}
export declare class Cacador extends Ocupacao {
    nome: string;
    combate: number;
    conhecimento: number;
    habilidade: number;
    sorte: number;
    habilidades: {
        nome: string;
        descricao: string;
    }[];
    equipType: number;
}
export declare class Piromaniaco extends Ocupacao {
    nome: string;
    combate: number;
    conhecimento: number;
    habilidade: number;
    sorte: number;
    habilidades: {
        nome: string;
        descricao: string;
    }[];
    equipType: number;
}
export declare class Gatuno extends Ocupacao {
    nome: string;
    combate: number;
    conhecimento: number;
    habilidade: number;
    sorte: number;
    habilidades: {
        nome: string;
        descricao: string;
    }[];
    equipType: number;
}
export declare class Lider extends Ocupacao {
    nome: string;
    combate: number;
    conhecimento: number;
    habilidade: number;
    sorte: number;
    habilidades: {
        nome: string;
        descricao: string;
    }[];
    equipType: number;
}
export declare class Xama extends Ocupacao {
    nome: string;
    combate: number;
    conhecimento: number;
    habilidade: number;
    sorte: number;
    habilidades: {
        nome: string;
        descricao: string;
    }[];
    equipType: number;
}
export declare function getRandomOcupacao(): IOcupacao;
export {};
