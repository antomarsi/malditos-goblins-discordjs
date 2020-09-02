"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomColoracao = exports.Azul = exports.Vermelho = exports.Amarelo = exports.VerdeEscuro = exports.Verde = exports.VerdeClaro = void 0;
class VerdeClaro {
    constructor() {
        this.nome = 'Verde Claro';
        this.cor = '#8dd381';
        this.combate = 2;
        this.conhecimento = 2;
        this.habilidade = 1;
        this.sorte = 1;
    }
}
exports.VerdeClaro = VerdeClaro;
class Verde {
    constructor() {
        this.nome = 'Verde';
        this.cor = '#239311';
        this.combate = 2;
        this.conhecimento = 2;
        this.habilidade = 1;
        this.sorte = 1;
    }
}
exports.Verde = Verde;
class VerdeEscuro {
    constructor() {
        this.nome = 'Verde Escuro';
        this.cor = '#083201';
        this.combate = 2;
        this.conhecimento = 1;
        this.habilidade = 2;
        this.sorte = 1;
    }
}
exports.VerdeEscuro = VerdeEscuro;
class Amarelo {
    constructor() {
        this.nome = 'Amarelo';
        this.cor = '#f1e902';
        this.combate = 1;
        this.conhecimento = 1;
        this.habilidade = 2;
        this.sorte = 2;
    }
}
exports.Amarelo = Amarelo;
class Vermelho {
    constructor() {
        this.nome = 'Vermelho';
        this.cor = '#c30000';
        this.combate = 1;
        this.conhecimento = 2;
        this.habilidade = 2;
        this.sorte = 1;
    }
}
exports.Vermelho = Vermelho;
class Azul {
    constructor() {
        this.nome = 'Azul';
        this.cor = '#0290d2';
        this.combate = 1;
        this.conhecimento = 2;
        this.habilidade = 1;
        this.sorte = 2;
    }
}
exports.Azul = Azul;
function getRandomColoracao() {
    let arr = [VerdeClaro, Verde, VerdeEscuro, Amarelo, Vermelho, Azul];
    return new arr[Math.floor(Math.random() * arr.length)]();
}
exports.getRandomColoracao = getRandomColoracao;
//# sourceMappingURL=Coloracao.js.map