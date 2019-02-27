"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class VerdeClaro {
    constructor() {
        this.nome = "Verde Claro";
        this.combate = 2;
        this.conhecimento = 2;
        this.habilidade = 1;
        this.sorte = 1;
    }
}
exports.VerdeClaro = VerdeClaro;
class Verde {
    constructor() {
        this.nome = "Verde";
        this.combate = 2;
        this.conhecimento = 2;
        this.habilidade = 1;
        this.sorte = 1;
    }
}
exports.Verde = Verde;
class VerdeEscuro {
    constructor() {
        this.nome = "Verde Escuro";
        this.combate = 2;
        this.conhecimento = 1;
        this.habilidade = 2;
        this.sorte = 1;
    }
}
exports.VerdeEscuro = VerdeEscuro;
class Amarelo {
    constructor() {
        this.nome = "Amarelo";
        this.combate = 1;
        this.conhecimento = 1;
        this.habilidade = 2;
        this.sorte = 2;
    }
}
exports.Amarelo = Amarelo;
class Vermelho {
    constructor() {
        this.nome = "Vermelho";
        this.combate = 1;
        this.conhecimento = 2;
        this.habilidade = 2;
        this.sorte = 1;
    }
}
exports.Vermelho = Vermelho;
class Azul {
    constructor() {
        this.nome = "Azul";
        this.combate = 1;
        this.conhecimento = 2;
        this.habilidade = 1;
        this.sorte = 2;
    }
}
exports.Azul = Azul;
function getRandomColoracao() {
    let arr = [VerdeClaro, Verde, VerdeEscuro, Amarelo, Vermelho, Azul];
    return new arr[(Math.floor(Math.random() * arr.length))]();
}
exports.getRandomColoracao = getRandomColoracao;
//# sourceMappingURL=Coloracao.js.map