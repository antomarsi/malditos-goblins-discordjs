import { IColoracao } from "../Interfaces";

export class VerdeClaro implements IColoracao {
  nome = "Verde Claro";
  combate = 2;
  conhecimento = 2;
  habilidade = 1;
  sorte = 1;
}

export class Verde implements IColoracao {
  nome = "Verde";
  combate = 2;
  conhecimento = 2;
  habilidade = 1;
  sorte = 1;
}

export class VerdeEscuro implements IColoracao {
  nome = "Verde Escuro";
  combate = 2;
  conhecimento = 1;
  habilidade = 2;
  sorte = 1;
}

export class Amarelo implements IColoracao {
  nome = "Amarelo";
  combate = 1;
  conhecimento = 1;
  habilidade = 2;
  sorte = 2;
}
export class Vermelho implements IColoracao {
  nome = "Vermelho";
  combate = 1;
  conhecimento = 2;
  habilidade = 2;
  sorte = 1;
}
export class Azul implements IColoracao {
  nome = "Azul";
  combate = 1;
  conhecimento = 2;
  habilidade = 1;
  sorte = 2;
}

export function getRandomColoracao(): IColoracao {
  let arr = [VerdeClaro, Verde, VerdeEscuro, Amarelo, Vermelho, Azul];
  return new arr[(Math.floor(Math.random() * arr.length))]();
}
