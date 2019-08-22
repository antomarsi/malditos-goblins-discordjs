"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Equipamento_1 = require("./Equipamento");
const Habilidades_1 = require("./Habilidades");
const getRandomEquipamento = (equipType) => {
    let equips = Equipamento_1.Equipamentos[equipType];
    return equips[Math.floor(Math.random() * equips.length)];
};
class Ocupacao {
    constructor() {
        this.nome = "";
        this.combate = 0;
        this.conhecimento = 0;
        this.habilidade = 0;
        this.sorte = 0;
        this.habilidades = [];
        this.equipType = Equipamento_1.EquipType.Pesado;
    }
    get equipamento() {
        return getRandomEquipamento(this.equipType);
    }
}
class Mercenario extends Ocupacao {
    constructor() {
        super(...arguments);
        this.nome = "Mercenário";
        this.combate = 1;
        this.conhecimento = 0;
        this.habilidade = 1;
        this.sorte = 0;
        this.habilidades = [
            Habilidades_1.Habilidades["MestreDeArmas"],
            Habilidades_1.Habilidades["AtaqueBrutal"],
            Habilidades_1.Habilidades["AtaqueFatal"]
        ];
        this.equipType = Equipamento_1.EquipType.Pesado;
    }
}
exports.Mercenario = Mercenario;
class Cacador extends Ocupacao {
    constructor() {
        super(...arguments);
        this.nome = "Caçador";
        this.combate = 1;
        this.conhecimento = 0;
        this.habilidade = 0;
        this.sorte = 1;
        this.habilidades = [
            Habilidades_1.Habilidades["Rastrear"],
            Habilidades_1.Habilidades["MiraCerteira"],
            Habilidades_1.Habilidades["TiroFatal"]
        ];
        this.equipType = Equipamento_1.EquipType.Leve;
    }
}
exports.Cacador = Cacador;
class Piromaniaco extends Ocupacao {
    constructor() {
        super(...arguments);
        this.nome = "Piromaníaco";
        this.combate = 0;
        this.conhecimento = 0;
        this.habilidade = 1;
        this.sorte = 1;
        this.habilidades = [
            Habilidades_1.Habilidades["Resistencia"],
            Habilidades_1.Habilidades["SuicidioExplosivo"],
            Habilidades_1.Habilidades["Imunidade"]
        ];
        this.equipType = Equipamento_1.EquipType.Exposivo;
    }
}
exports.Piromaniaco = Piromaniaco;
class Gatuno extends Ocupacao {
    constructor() {
        super(...arguments);
        this.nome = "Gatuno";
        this.combate = 0;
        this.conhecimento = 1;
        this.habilidade = 1;
        this.sorte = 0;
        this.habilidades = [
            Habilidades_1.Habilidades["Roubar"],
            Habilidades_1.Habilidades["ArmarArmadilhas"],
            Habilidades_1.Habilidades["AtaqueFurtivo"]
        ];
        this.equipType = Equipamento_1.EquipType.Leve;
    }
}
exports.Gatuno = Gatuno;
class Lider extends Ocupacao {
    constructor() {
        super(...arguments);
        this.nome = "Líder";
        this.combate = 1;
        this.conhecimento = 1;
        this.habilidade = 0;
        this.sorte = 0;
        this.habilidades = [
            Habilidades_1.Habilidades["GritoDeGuerra"],
            Habilidades_1.Habilidades["AtaqueBrutal"],
            Habilidades_1.Habilidades["AtaqueFatal"]
        ];
        this.equipType = Equipamento_1.EquipType.Pesado;
    }
}
exports.Lider = Lider;
class Xama extends Ocupacao {
    constructor() {
        super(...arguments);
        this.nome = "Xamã";
        this.combate = 1;
        this.conhecimento = 1;
        this.habilidade = 0;
        this.sorte = 1;
        this.habilidades = [
            Habilidades_1.Habilidades["RaioDeEnergia"],
            Habilidades_1.Habilidades["Cura"],
            Habilidades_1.Habilidades["Petrificar"]
        ];
        this.equipType = Equipamento_1.EquipType.Magico;
    }
}
exports.Xama = Xama;
function getRandomOcupacao() {
    let arr = [Mercenario, Cacador, Piromaniaco, Gatuno, Lider, Xama];
    return new arr[(Math.floor(Math.random() * arr.length))]();
}
exports.getRandomOcupacao = getRandomOcupacao;
//# sourceMappingURL=Ocupacao.js.map