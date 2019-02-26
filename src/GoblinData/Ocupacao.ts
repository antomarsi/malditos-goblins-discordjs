import { IOcupacao } from "../Interfaces";
import { EquipamentoLeve, EquipamentoPesado, EquipamentoMagico, EquipamentoExposivo } from './Equipamento';
import {
  MestreDeArmas,
  AtaqueBrutal,
  AtaqueFatal,
  Rastrear,
  MiraCerteira,
  TiroFatal,
  Resistencia,
  SuicidioExplosivo,
  Imunidade,
  Roubar,
  ArmarArmadilhas,
  AtaqueFurtivo,
  GritoDeGuerra,
  RaioDeEnergia,
  Cura,
  Petrificar
} from "./Habilidades";

export class Mercenario implements IOcupacao {
  nome = "Mercenário";
  combate = 1;
  conhecimento = 0;
  habilidade = 1;
  sorte = 0;
  habilidades = [
    MestreDeArmas.toString(),
    AtaqueBrutal.toString(),
    AtaqueFatal.toString()
  ];
  equipamento = new EquipamentoPesado();
}
export class Cacador implements IOcupacao {
  nome = "Caçador";
  combate = 1;
  conhecimento = 0;
  habilidade = 0;
  sorte = 1;
  habilidades = [
    Rastrear.toString(),
    MiraCerteira.toString(),
    TiroFatal.toString()
  ];
  equipamento = new EquipamentoLeve();
}
export class Piromaniaco implements IOcupacao {
  nome = "Piromaníaco";
  combate = 0;
  conhecimento = 0;
  habilidade = 1;
  sorte = 1;
  habilidades = [
    Resistencia.toString(),
    SuicidioExplosivo.toString(),
    Imunidade.toString()
  ];
  equipamento = new EquipamentoExposivo();
}
export class Gatuno implements IOcupacao {
  nome = "Gatuno";
  combate = 0;
  conhecimento = 1;
  habilidade = 1;
  sorte = 0;
  habilidades = [
    Roubar.toString(),
    ArmarArmadilhas.toString(),
    AtaqueFurtivo.toString()
  ];
  equipamento = new EquipamentoLeve();
}
export class Lider implements IOcupacao {
  nome = "Líder";
  combate = 1;
  conhecimento = 1;
  habilidade = 0;
  sorte = 0;
  habilidades = [
    GritoDeGuerra.toString(),
    AtaqueBrutal.toString(),
    AtaqueFatal.toString()
  ];
  equipamento = new EquipamentoPesado();
}
export class Xama implements IOcupacao {
  nome = "Xamã";
  combate = 1;
  conhecimento = 1;
  habilidade = 0;
  sorte = 1;
  habilidades = [
    RaioDeEnergia.toString(),
    Cura.toString(),
    Petrificar.toString()
  ];
  equipamento = new EquipamentoMagico();
}

export function getRandomOcupacao(): IOcupacao {
  let arr = [Mercenario, Cacador, Piromaniaco, Gatuno, Lider, Xama];
  return new arr[(Math.floor(Math.random() * arr.length))]();
}
