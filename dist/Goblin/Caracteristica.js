"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Caracteristica {
    constructor() {
        this.nome = "";
        this.descricao = "";
    }
    toString() {
        return `${this.nome}: ${this.descricao}`;
    }
}
class Insano extends Caracteristica {
    constructor() {
        super(...arguments);
        this.nome = "Insano";
        this.descricao = "Você não tem controle de seus atos. Sempre que o mestre quiser, ele pode pedir um teste de Sorte (dificuldade 5). Se você falhar, o mestre poderá decidir um ato idiota para seu personagem fazer.";
    }
}
exports.Insano = Insano;
class Fedorento extends Caracteristica {
    constructor() {
        super(...arguments);
        this.nome = "Fedorento";
        this.descricao = "Você fede e ninguém gosta de ficar perto. Qualquer um que fique por mais de 1 minuto perto de você, poderá ficar nauseado e vomitar.";
    }
}
exports.Fedorento = Fedorento;
class Cicatrizes extends Caracteristica {
    constructor() {
        super(...arguments);
        this.nome = "Cicatrizes";
        this.descricao = "Você possui muitas cicatrizes de muitas batalhas. As fêmeas goblins nunca olharão para você.";
    }
}
exports.Cicatrizes = Cicatrizes;
class Gordo extends Caracteristica {
    constructor() {
        super(...arguments);
        this.nome = "Gordo";
        this.descricao = "Você é obeso e tem problemas em passar em buracos estreitos, se esconder e não consegue correr por muito tempo.";
    }
}
exports.Gordo = Gordo;
class FalaErrado extends Caracteristica {
    constructor() {
        super(...arguments);
        this.nome = "Fala errado";
        this.descricao = "Você tem algum problema de comunicação (gagueira, língua presa, troca letras, etc) e isso irrita muito os seus companheiros.";
    }
}
exports.FalaErrado = FalaErrado;
class Anomalia {
    constructor() {
        this.nome = "Anomalia";
        this.descricao = "Você possui uma anomalia genética.";
        this.anomalies = [
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
    }
    getAnomalies(anomalies = []) {
        let dice_value = Math.floor(Math.random() * 10 + 2);
        if (dice_value <= 3) {
            anomalies.push(this.anomalies[0]);
        }
        else if (dice_value > 3 && dice_value <= 10) {
            if (dice_value == 6) {
                let anomaly = this.anomalies[5];
                anomalies.push(anomaly.replace("{0}", Math.floor(Math.random() * 6 + 1).toString()));
            }
            else {
                anomalies.push(this.anomalies[dice_value - 2]);
            }
        }
        else if (dice_value > 10) {
            anomalies = this.getAnomalies(anomalies);
            anomalies = this.getAnomalies(anomalies);
        }
        return anomalies;
    }
    toString() {
        return `${this.nome}: ${this.descricao} (${this.getAnomalies().join(", ")})`;
    }
}
exports.Anomalia = Anomalia;
function getRandomCaracteristica() {
    let arr = [Insano, Fedorento, Cicatrizes, Gordo, FalaErrado, Anomalia];
    return new arr[(Math.floor(Math.random() * arr.length))]();
}
exports.getRandomCaracteristica = getRandomCaracteristica;
//# sourceMappingURL=Caracteristica.js.map