import { ICaracteristica } from "../Interfaces";

abstract class Caracteristica implements ICaracteristica {
  nome = "";
  descricao = "";
  toString(): string {
    return `${this.nome}: ${this.descricao}`;
  }
}

export class Insano extends Caracteristica {
  nome = "Insano";
  descricao =
    "Você não tem controle de seus atos. Sempre que o mestre quiser, ele pode pedir um teste de Sorte (dificuldade 5). Se você falhar, o mestre poderá decidir um ato idiota para seu personagem fazer.";
}
export class Fedorento extends Caracteristica {
  nome = "Fedorento";
  descricao =
    "Você fede e ninguém gosta de ficar perto. Qualquer um que fique por mais de 1 minuto perto de você, poderá ficar nauseado e vomitar.";
}
export class Cicatrizes extends Caracteristica {
  nome = "Cicatrizes";
  descricao =
    "Você possui muitas cicatrizes de muitas batalhas. As fêmeas goblins nunca olharão para você.";
}
export class Gordo extends Caracteristica {
  nome = "Gordo";
  descricao =
    "Você é obeso e tem problemas em passar em buracos estreitos, se esconder e não consegue correr por muito tempo.";
}
export class FalaErrado extends Caracteristica {
  nome = "Fala errado";
  descricao =
    "Você tem algum problema de comunicação (gagueira, língua presa, troca letras, etc) e isso irrita muito os seus companheiros.";
}
export class Anomalia implements ICaracteristica {
  nome = "Anomalia";
  descricao = "Você possui uma anomalia genética.";

  anomalies: string[] = [
    "Manchas Rosas",
    "Manchas Rosas",
    "Orelhas no sovaco",
    "Corcunda",
    "Braço extra atrofiado",
    "{0} Olhos",
    "Olhos Gigantes",
    "Mãos Gigantes",
    "Duas Cabeças"
  ];

  getAnomalies(anomalies: string[] = []): string[] {
    let dice_value = Math.floor(Math.random() * 10 + 2);
    if (dice_value <= 3) {
      anomalies.push(this.anomalies[0]);
    } else if (dice_value > 3 && dice_value <= 10) {
      if (dice_value == 6) {
        let anomaly = this.anomalies[5];
        anomalies.push(
          anomaly.replace("{0}", Math.floor(Math.random() * 6 + 1).toString())
        );
      } else {
        anomalies.push(this.anomalies[dice_value - 2]);
      }
    } else if (dice_value > 10) {
      anomalies = this.getAnomalies(anomalies);
      anomalies = this.getAnomalies(anomalies);
    }
    return anomalies;
  }

  toString(): string {
    return `${this.nome}: ${this.descricao} (${this.getAnomalies().join(
      ", "
    )})`;
  }
}

export function getRandomCaracteristica(): ICaracteristica {
  let arr = [Insano, Fedorento, Cicatrizes, Gordo, FalaErrado, Anomalia];
  return new arr[(Math.floor(Math.random() * arr.length))]();
}
