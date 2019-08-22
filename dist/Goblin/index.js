"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ocupacao_1 = require("./Ocupacao");
const Coloracao_1 = require("./Coloracao");
const Caracteristica_1 = require("./Caracteristica");
class Goblin {
    constructor(nome) {
        if (nome) {
            this.nome = nome;
        }
        else {
            this.nome = this.generateName();
        }
        this.ocupacao = Ocupacao_1.getRandomOcupacao();
        this.coloracao = Coloracao_1.getRandomColoracao();
        this.caracteristica = Caracteristica_1.getRandomCaracteristica();
    }
    generateName() {
        let prefix = ["Sp", "Cr", "Bu", "Ut", "An", "Om"];
        let sufix = ["or", "ut", "ar", "an", "an", "ec"];
        return (prefix[Math.floor(Math.random() * prefix.length)] +
            sufix[Math.floor(Math.random() * sufix.length)]);
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
//# sourceMappingURL=index.js.map