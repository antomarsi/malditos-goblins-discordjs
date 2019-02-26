import { Ocupacao } from './Commands/Interfaces';

class Mercenario implements Ocupacao {
  nome = "Mercenário";
  combate = 1;
  conhecimento = 0;
  habilidade = 1;
  sorte = 0;
}
class Cacador implements Ocupacao {
  nome = "Caçador";
  combate = 1;
  conhecimento = 0;
  habilidade = 0;
  sorte = 1;
}
class Piromaniaco implements Ocupacao {
  nome = "Piromaníaco";
  combate = 0;
  conhecimento = 0;
  habilidade = 1;
  sorte = 1;
}
class Gatuno implements Ocupacao {
  nome = "Gatuno";
  combate = 0;
  conhecimento = 1;
  habilidade = 1;
  sorte = 0;
}
class Lider implements Ocupacao {
  nome = "Líder";
  combate = 1;
  conhecimento = 1;
  habilidade = 0;
  sorte = 0;
}
class Xama implements Ocupacao {
  nome = "Xamã";
  combate = 1;
  conhecimento = 1;
  habilidade = 0;
  sorte = 1;
}

function getRandomOcupacao() : Ocupacao {
  let arr = [Mercenario, Cacador, Piromaniaco, Gatuno, Lider, Xama];
  return new arr[Math.floor(Math.random() * arr.length)]();
}

export default {Mercenario, Cacador, Piromaniaco, Gatuno, Lider, Xama, getRandomOcupacao};