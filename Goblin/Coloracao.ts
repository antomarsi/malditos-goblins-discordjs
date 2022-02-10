export interface IColoracao {
  nome: string
  cor: string
  combate: number
  conhecimento: number
  habilidade: number
  sorte: number
}

export class VerdeClaro implements IColoracao {
  nome = 'Verde Claro'
  cor = '#8dd381'
  combate = 2
  conhecimento = 2
  habilidade = 1
  sorte = 1
}

export class Verde implements IColoracao {
  nome = 'Verde'
  cor = '#239311'
  combate = 2
  conhecimento = 2
  habilidade = 1
  sorte = 1
}

export class VerdeEscuro implements IColoracao {
  nome = 'Verde Escuro'
  cor = '#083201'
  combate = 2
  conhecimento = 1
  habilidade = 2
  sorte = 1
}

export class Amarelo implements IColoracao {
  nome = 'Amarelo'
  cor = '#f1e902'
  combate = 1
  conhecimento = 1
  habilidade = 2
  sorte = 2
}
export class Vermelho implements IColoracao {
  nome = 'Vermelho'
  cor = '#c30000'
  combate = 1
  conhecimento = 2
  habilidade = 2
  sorte = 1
}
export class Azul implements IColoracao {
  nome = 'Azul'
  cor = '#0290d2'
  combate = 1
  conhecimento = 2
  habilidade = 1
  sorte = 2
}

export function getRandomColoracao(): IColoracao {
  let arr = [VerdeClaro, Verde, VerdeEscuro, Amarelo, Vermelho, Azul]
  return new arr[Math.floor(Math.random() * arr.length)]()
}
