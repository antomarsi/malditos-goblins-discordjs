"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ocupacao_1 = require("./GoblinData/Ocupacao");
const Coloracao_1 = require("./GoblinData/Coloracao");
const Caracteristica_1 = require("./GoblinData/Caracteristica");
class Goblin {
    constructor(name) {
        this.ocupacao = Ocupacao_1.getRandomOcupacao();
        this.coloracao = Coloracao_1.getRandomColoracao();
        this.caracteristica = Caracteristica_1.getRandomCaracteristica();
    }
    get combate() {
        return this.ocupacao.combate + this.coloracao.combate;
    }
    get conhecimento() {
        return this.ocupacao.conhecimento + this.coloracao.conhecimento;
    }
    get habilidade() {
        return this.ocupacao.habilidade + this.coloracao.habilidade;
    }
    get sorte() {
        return this.ocupacao.sorte + this.coloracao.sorte;
    }
}
exports.default = Goblin;
//# sourceMappingURL=Goblin.js.map