import { ICaracteristica } from "../Interfaces";
declare abstract class Caracteristica implements ICaracteristica {
    nome: string;
    descricao: string;
    toString(): string;
}
export declare class Insano extends Caracteristica {
    nome: string;
    descricao: string;
}
export declare class Fedorento extends Caracteristica {
    nome: string;
    descricao: string;
}
export declare class Cicatrizes extends Caracteristica {
    nome: string;
    descricao: string;
}
export declare class Gordo extends Caracteristica {
    nome: string;
    descricao: string;
}
export declare class FalaErrado extends Caracteristica {
    nome: string;
    descricao: string;
}
export declare class Anomalia implements ICaracteristica {
    nome: string;
    descricao: string;
    anomalies: string[];
    getAnomalies(anomalies?: string[]): string[];
    toString(): string;
}
export declare function getRandomCaracteristica(): ICaracteristica;
export {};
