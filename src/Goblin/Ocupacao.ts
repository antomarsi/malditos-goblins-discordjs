import { EquipType, Equipamentos } from "./Equipamento";
import { Habilidades } from "./Habilidades";

export interface IOcupacao {
  nome: string;
  combate: number;
  conhecimento: number;
  habilidade: number;
  sorte: number;
  habilidades: any[];
  equipamento: string;
}

const getRandomEquipamento = (equipType: number): string => {
  let equips: string[] = Equipamentos[equipType];
  return equips[Math.floor(Math.random() * equips.length)];
};

class Ocupacao implements IOcupacao {
  nome = "";
  combate = 0;
  conhecimento = 0;
  habilidade = 0;
  sorte = 0;
  habilidades: any[] = [];
  equipType = EquipType.Pesado;
  get equipamento(): string {
    return getRandomEquipamento(this.equipType);
  }
}

export class Mercenario extends Ocupacao {
  nome = "Mercenário";
  combate = 1;
  conhecimento = 0;
  habilidade = 1;
  sorte = 0;
  habilidades = [
    Habilidades["MestreDeArmas"],
    Habilidades["AtaqueBrutal"],
    Habilidades["AtaqueFatal"]
  ];
  equipType = EquipType.Pesado;
}
export class Cacador extends Ocupacao {
  nome = "Caçador";
  combate = 1;
  conhecimento = 0;
  habilidade = 0;
  sorte = 1;
  habilidades = [
    Habilidades["Rastrear"],
    Habilidades["MiraCerteira"],
    Habilidades["TiroFatal"]
  ];
  equipType = EquipType.Leve;
}
export class Piromaniaco extends Ocupacao {
  nome = "Piromaníaco";
  combate = 0;
  conhecimento = 0;
  habilidade = 1;
  sorte = 1;
  habilidades = [
    Habilidades["Resistencia"],
    Habilidades["SuicidioExplosivo"],
    Habilidades["Imunidade"]
  ];
  equipType = EquipType.Exposivo;
}
export class Gatuno extends Ocupacao {
  nome = "Gatuno";
  combate = 0;
  conhecimento = 1;
  habilidade = 1;
  sorte = 0;
  habilidades = [
    Habilidades["Roubar"],
    Habilidades["ArmarArmadilhas"],
    Habilidades["AtaqueFurtivo"]
  ];
  equipType = EquipType.Leve;
}
export class Lider extends Ocupacao {
  nome = "Líder";
  combate = 1;
  conhecimento = 1;
  habilidade = 0;
  sorte = 0;
  habilidades = [
    Habilidades["GritoDeGuerra"],
    Habilidades["AtaqueBrutal"],
    Habilidades["AtaqueFatal"]
  ];
  equipType = EquipType.Pesado;
}
export class Xama extends Ocupacao {
  nome = "Xamã";
  combate = 1;
  conhecimento = 1;
  habilidade = 0;
  sorte = 1;
  habilidades = [
    Habilidades["RaioDeEnergia"],
    Habilidades["Cura"],
    Habilidades["Petrificar"]
  ];
  equipType = EquipType.Magico;
}

export function getRandomOcupacao(): IOcupacao {
  let arr = [Mercenario, Cacador, Piromaniaco, Gatuno, Lider, Xama];
  return new arr[(Math.floor(Math.random() * arr.length))]();
}
