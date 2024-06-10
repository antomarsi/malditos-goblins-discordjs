"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Goblin = void 0;
const tslib_1 = require("tslib");
const caracteristicas_json_1 = tslib_1.__importDefault(require("../data/caracteristicas.json"));
const magias_json_1 = tslib_1.__importDefault(require("../data/magias.json"));
const equipamentos_json_1 = tslib_1.__importDefault(require("../data/equipamentos.json"));
const nomes_json_1 = tslib_1.__importDefault(require("../data/nomes.json"));
const ocupacoes_json_1 = tslib_1.__importDefault(require("../data/ocupacoes.json"));
const math_1 = require("../utils/math");
function isWeapon(item) {
    return 'ataque' in item;
}
function isProtection(item) {
    return 'durabilidade' in item;
}
function hasSpecial(item) {
    return "special" in item;
}
class Goblin {
    nome;
    ocupation;
    descritor;
    caracteristica;
    _equips;
    _magics;
    constructor(name, ocupation, descritor, charac, equips, magics) {
        this.nome = name;
        this.ocupation = ocupation;
        this.descritor = descritor;
        this.caracteristica = charac;
        this._equips = equips;
        this._magics = magics;
    }
    get hasMagic() {
        return this.ocupation.useMagic == true;
    }
    get magics() {
        return this._magics?.map(v => {
            return magias_json_1.default.find(j => j.type == v)?.title;
        }).filter(i => i != undefined);
    }
    static getSpecialStr(spc) {
        return `${spc.title}: ${spc.description}`;
    }
    get equipamentos() {
        const equipObj = this.ocupation.equipamentos[this._equips].map(v => Goblin.getEquipInvDescription(v));
        const result = equipObj.reduce((acc, cur) => {
            acc.value = `${acc.value}${cur.value}\n`;
            if (cur.special) {
                for (const special of cur.special) {
                    if (!cur.special.find(v => v.title === special.title)) {
                        cur.special.push(special);
                    }
                }
            }
            return cur;
        }, { value: "", special: [] });
        return `${result.value}\n**Especiais:**\n${result.special?.map(v => Goblin.getSpecialStr(v))?.join("\n")}`;
    }
    get combate() {
        return this.ocupation.stats.combate + this.descritor.stats.combate;
    }
    get habilidade() {
        return this.ocupation.stats.habilidade + this.descritor.stats.habilidade;
    }
    get nocao() {
        return this.ocupation.stats.nocao + this.descritor.stats.nocao;
    }
    get vitalidade() {
        return this.ocupation.stats.vitalidade + this.descritor.stats.vitalidade;
    }
    static getSpecial(name, title) {
        let special = (equipamentos_json_1.default[name]?.specials || []).find((v) => v.title = title);
        return special;
    }
    static getMagics() {
        return magias_json_1.default.map(v => ({ title: v.title, value: v.type, emoji: v.emoji }));
    }
    static getMagicDice(type, hits) {
        const magic = magias_json_1.default.find(v => v.type == type);
        if (!magic || hits < 0) {
            return undefined;
        }
        if (hits < 3) {
            return { title: magic.title, description: magic.value[hits - 1] };
        }
        else {
            return { title: magic.title, description: magic.value[2] };
        }
    }
    static getEquip(name, title) {
        switch (name) {
            case "armas":
                let arma = (equipamentos_json_1.default.armas?.values || []).find((v) => v.title == title);
                return {
                    ...arma, special: arma?.special?.map(v => {
                        let special = this.getSpecial(name, v.type);
                        return special ? { ...special, qtd: v.qtd } : undefined;
                    }).filter(v => v != undefined)
                };
            case "protecao":
                let protecao = (equipamentos_json_1.default.protecao?.values || []).find((v) => v.title == title);
                return {
                    ...protecao, special: protecao?.special?.map(v => {
                        let special = this.getSpecial(name, v.type);
                        return special ? { ...special } : undefined;
                    }).filter(v => v != undefined)
                };
            default:
                return (equipamentos_json_1.default.outros?.values || []).find((v) => v.title == title) || { "title": title };
        }
    }
    static getAllEquipsByType(type) {
        const items = equipamentos_json_1.default[type].values.map(v => {
            const equip = Goblin.getEquip(type, v.title);
            return Goblin.getEquipTitle(equip);
        });
        let specials = [];
        if (type !== "outros") {
            specials = equipamentos_json_1.default[type].specials.map(v => `**${v.title}**: ${v.description}`);
        }
        return { items, specials };
    }
    static getEquipTitle(equip, qtd) {
        let title = `**${equip.title}**`;
        if (isWeapon(equip)) {
            title += ` (${equip.uso}, ${equip.ataque}, ${equip.bonus}${equip.special ? ", " + equip.special?.map(v => v.qtd ? `${v.title} [${v.qtd}]` : v.title).join(", ") : ""}}`;
        }
        else if (isProtection(equip)) {
            title += ` (${equip.uso}, durab. ${equip.durabilidade}${equip.special ? ", " + equip.special?.map(v => v.title).join(", ") : ""})`;
        }
        return (qtd && qtd > 1 ? `${qtd}x` : "") + title;
    }
    static getEquipInvDescription(equip) {
        const equipValue = this.getEquip(equip.type, equip.value);
        const equipTitle = this.getEquipTitle(equipValue, equip.qtd);
        let special = [];
        if (hasSpecial(equipValue)) {
            special = equipValue.special;
        }
        return {
            value: equipTitle,
            special: special
        };
    }
    static getEquipsDescription(equips) {
        const equipamentos = equips.map((v) => {
            let equip = this.getEquip(v.type, v.value);
            return { equip, qtd: v.qtd };
        }).reduce((acc, cur) => {
            const title = cur.qtd > 1 ? `${cur.qtd} ${cur.equip.title}` : cur.equip.title;
            acc.title.push(title);
            if (hasSpecial(equips)) {
                equips.special?.forEach(special => {
                    const desc = `${special.title}: ${special.description}`;
                    if (!acc.description.includes(desc)) {
                        acc.description.push(desc);
                    }
                });
            }
            return acc;
        }, { title: [], description: [] });
        return {
            title: equipamentos.title.join(", "),
            description: equipamentos.description.join("\n")
        };
    }
    static generateOcupation() {
        const dice = (0, math_1.randomInt)(0, 5);
        return ocupacoes_json_1.default.ocupacao[dice];
    }
    static generateDescritor() {
        let dice = (0, math_1.randomInt)(0, 5);
        return ocupacoes_json_1.default.descritor[dice];
    }
    static generateCharacteristic() {
        while (true) {
            let dice = (0, math_1.randomInt)(0, 5);
            let dice2 = (0, math_1.randomInt)(0, 5);
            let value = `${dice}${dice2}`;
            let charac = caracteristicas_json_1.default.find(v => v.value == value);
            if (charac && !charac?.reroll) {
                return {
                    title: charac.title,
                    description: charac.description
                };
            }
        }
    }
    static generateName() {
        const dice = (0, math_1.randomInt)(0, 5);
        const dice2 = (0, math_1.randomInt)(0, 5);
        return nomes_json_1.default[dice][dice2];
    }
}
exports.Goblin = Goblin;
