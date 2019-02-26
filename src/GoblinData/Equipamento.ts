import { IEquipamentos } from "../Interfaces";

abstract class Equipamento implements IEquipamentos {
  equipamentos: string[] = [];
  getRandomEquipamento(): string {
    return this.equipamentos[
      Math.floor(Math.random() * this.equipamentos.length)
    ];
  }
}

export class EquipamentoLeve extends Equipamento {
  equipamentos: string[] = [
    "2 Adagas (arremessável, dano 2)",
    "Adaga (arremessável, dano 2) e Escudo (proteção 1)",
    "Arco Simples (distância; dano 2)",
    "Arco Composto (distância; dano 3)",
    "4 Adagas* (dano 2)",
    "Besta (distância; dano 3) e Elmo (proteção 1)"
  ];
}

export class EquipamentoPesado extends Equipamento {
  equipamentos: string[] = [
    "Espada (dano 3) e Escudo (proteção  1)",
    "Machado (dano 4) e Elmo (proteção 1)",
    "2 Machadinhas (arremessável, dano 3)",
    "Espadona (dano 5)",
    "2 Espadas (dano 3) e Armadura (proteção 1)",
    "Adaga (arremessável), Espada e Armadura (proteção  1)"
  ];
}

export class EquipamentoExposivo extends Equipamento {
  equipamentos: string[] = [
    "Pistola (distância, dano 4) e Elmo (proteção 1)",
    "2 Pistolas (distância, dano 4)",
    "3 Galinhas Explosivas (distância, dano 4 em todos até 3m)",
    "Barril de Pólvora (dano 5 em todos até 3m)",
    "Pistola (distância, dano 4) e 2 Galinhas Explosivas (distância, dano 4 em todos até 3m)",
    "Canhão (distância, dano 8; carregar [2 turnos])"
  ];
}

export class EquipamentoMagico extends Equipamento {
  equipamentos: string[] = ["Cajado (dano 1)"];
  getRandomEquipamento(): string {
    return this.equipamentos[0];
  }
}
