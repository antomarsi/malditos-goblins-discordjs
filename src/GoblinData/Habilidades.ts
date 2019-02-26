import { IHabilidade } from "../Interfaces";

abstract class Habilidade implements IHabilidade {
  nome = "";
  descricao = "";
  toString(): string {
    return `${this.nome}: ${this.descricao}`;
  }
}

export class MestreDeArmas extends Habilidade {
  nome: "Mestre de Armas";
  descricao: "Você sempre rola +1 dado em todos os ataques que você fizer lutando com sua arma favorita (Escolha uma).";
}

export class AtaqueBrutal extends Habilidade {
  nome = "Ataque Brutal";
  descricao =
    "Uma vez ao dia voce pode fazer um ataque brutal, que causa o dobro de dano na vítima.";
}
export class AtaqueFatal extends Habilidade {
  nome = "Ataque Fatal";
  descricao =
    "Uma vez ao dia você pode fazer um ataque fatal. Se acertar, a vitima deverá vencer um teste de Sorte (Dificuldade 5) ou morrerá imediatamente.";
}
export class Rastrear extends Habilidade {
  nome = "Rastrear";
  descricao =
    "Com um teste bem sucedido de Conhecimento (dificuldade 3) você pode rastrear qualquer criatura.";
}
export class MiraCerteira extends Habilidade {
  nome = "Mira Certeira";
  descricao = "Você ignora a proteção dos seus oponentes.";
}
export class TiroFatal extends Habilidade {
  nome = "Tiro Fatal";
  descricao =
    "Uma vez ao dia você pode fazer um ataque à distância fatal. Se acertar, a vitima deverá vencer um teste de Sorte (Dificuldade 5) ou morrerá imediatamente.";
}
export class Resistencia extends Habilidade {
  nome = "Resistência";
  descricao =
    "Você pode fazer um teste de Sorte (dificuldade 5) quando receber dano de fogo ou explosão de fogo. Se vencer, você não recebe dano.";
}
export class SuicidioExplosivo extends Habilidade {
  nome = "Suicídio Explosivo";
  descricao =
    "Usando sua arma, você pode se explodir e matar TODOS os que estiverem na área da explosão.";
}
export class Imunidade extends Habilidade {
  nome = "Imunidade";
  descricao = "Você nunca recebe dano com fogo ou explosão.";
}
export class Roubar extends Habilidade {
  nome = "Roubar";
  descricao =
    "Você pode roubar sem ser visto se vencer um teste resistido de Habilidade contra a vítima.";
}
export class ArmarArmadilhas extends Habilidade {
  nome = "Armar Armadilhas";
  descricao =
    "Você pode fazer uma armadilha em qualquer lugar se tiver alguns materiais. A pessoa terá que passar em um teste de Sorte (dificuldade 5) para não cair na sua armadilha.";
}
export class AtaqueFurtivo extends Habilidade {
  nome = "Ataque Furtivo";
  descricao =
    "Se você não foi visto, você pode fazer um ataque furtivo. Se acertar, a vitima deverá fazer um teste de Sorte (Dificuldade 5). Se ela falhar ela morrerá.";
}
export class GritoDeGuerra extends Habilidade {
  nome = "Grito de Guerra";
  descricao =
    "Uma vez ao dia você pode dar um grito que permitirá que todos seus aliados rolem 1 dado a mais para se esquivar até o final da batalha.";
}
export class RaioDeEnergia extends Habilidade {
  nome = "Raio de Energia";
  descricao =
    "Você pode gastar pontos de magia para fazer ataques a distância. Cada ponto gasto causará um ponto de dano (pode gastar mais para fazer ataque com mais dano).";
}
export class Cura extends Habilidade {
  nome = "Cura";
  descricao =
    "Você pode gastar seus pontos de magia para curar seus aliados. Cada ponto de magia recupera um ponto de vitalidade.";
}
export class Petrificar extends Habilidade {
  nome = "Petrificar";
  descricao =
    "Gastando 6 pontos de magia você pode paralisar qualquer criatura.";
}
