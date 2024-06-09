import caracteristicas from "../data/caracteristicas.json"
import magias from "../data/magias.json"
import equipamentos from "../data/equipamentos.json"
import nomes from "../data/nomes.json"
import ocupacoes from "../data/ocupacoes.json"
import { randomInt } from "../utils/math"

interface Attributes {
    combate: number
    habilidade: number
    nocao: number
    vitalidade: number
}

interface Skill {
    title: string
    description: string
}

interface Magic {
    type: string
    title: string
    emoji: string
    values: string[]
}
interface EquipInv {
    type: string,
    value: string,
    qtd: number
}

interface Special {
    title: string
    description: string
    qtd?: number
}

interface Weapon {
    title: string,
    uso: string,
    ataque: string,
    bonus: string,
    special?: Special[]
}

interface Protection {
    title: string,
    uso: string,
    durabilidade: string
    special?: Special[]
}
interface Other {
    title: string
    description?: string
}

type Equip = Weapon | Protection | Other

function isWeapon(item: any): item is Weapon {
    return 'ataque' in item
}
function isProtection(item: any): item is Protection {
    return 'durabilidade' in item
}
function hasSpecial(item: any): item is Weapon | Protection {
    return "special" in item
}

interface Ocupation {
    title: string
    value: string
    stats: Attributes
    skills: Skill[]
    useMagic?: boolean
    equipamentos: EquipInv[][]
}
interface Descritor {
    title: string
    value: string
    choose?: boolean
    stats: Attributes
}

interface Characteristic {
    title: string
    description: string
}

export class Goblin {

    nome: string
    ocupation: Ocupation
    descritor: Descritor
    caracteristica: Characteristic
    _equips: number
    _magics?: string[]

    constructor(name: string, ocupation: Ocupation, descritor: Descritor, charac: Characteristic, equips: number, magics?: string[]) {
        this.nome = name
        this.ocupation = ocupation
        this.descritor = descritor
        this.caracteristica = charac
        this._equips = equips
        this._magics = magics
    }

    public get hasMagic(): boolean {
        return this.ocupation.useMagic == true
    }
    public get magics(): string[] {
        return this._magics?.map(v => {
            return magias.find(j => j.type == v)?.title
        }).filter(i => i != undefined) as string[]
    }

    private static getSpecialStr(spc: Special): string {
        return `${spc.title}: ${spc.description}`
    }

    public get equipamentos(): string {
        const equipObj = this.ocupation.equipamentos[this._equips].map(v => Goblin.getEquipInvDescription(v))

        const result = equipObj.reduce((acc, cur) => {
            acc.value = `${acc.value}${cur.value}\n`
            if (cur.special) {
                for (const special of cur.special) {
                    if (!cur.special.find(v => v.title === special.title)) {
                        cur.special.push(special)
                    }
                }
            }
            return cur
        }, { value: "", special: [] })

        return `${result.value}\n**Especiais:**\n${result.special?.map(v => Goblin.getSpecialStr(v))?.join("\n")}`

    }

    public get combate(): number {
        return this.ocupation.stats.combate + this.descritor.stats.combate;
    }
    public get habilidade(): number {
        return this.ocupation.stats.habilidade + this.descritor.stats.habilidade;
    }
    public get nocao(): number {
        return this.ocupation.stats.nocao + this.descritor.stats.nocao;
    }
    public get vitalidade(): number {
        return this.ocupation.stats.vitalidade + this.descritor.stats.vitalidade;
    }

    public static getSpecial(name: "armas" | "protecao", title: string): Special | undefined {
        let special = (equipamentos[name]?.specials || []).find((v) => v.title = title)

        return special
    }

    public static getMagics(): { title: string, value: string, emoji: string }[] {
        return magias.map(v => ({ title: v.title, value: v.type, emoji: v.emoji }))
    }

    public static getMagicDice(type: string, hits: number): {
        title: string,
        description: string
    } | undefined {
        const magic = magias.find(v => v.type == type)
        if (!magic || hits < 0) {
            return undefined
        }
        if (hits < 3) {
            return { title: magic.title, description: magic.value[hits - 1]}

        } else {
            return { title: magic.title, description: magic.value[2]}
        }
    }

    public static getEquip(name: "armas" | "protecao" | "outros", title: string): Weapon | Protection | Other {
        switch (name) {
            case "armas":
                let arma = (equipamentos.armas?.values || []).find((v) => v.title == title)

                return {
                    ...arma, special: arma?.special?.map(v => {
                        let special = this.getSpecial(name, v.type)
                        return special ? { ...special, qtd: v.qtd } as Special : undefined
                    }).filter(v => v != undefined)
                } as Weapon
            case "protecao":
                let protecao = (equipamentos.protecao?.values || []).find((v) => v.title == title)
                return {
                    ...protecao, special: protecao?.special?.map(v => {
                        let special = this.getSpecial(name, v.type)
                        return special ? { ...special } as Special : undefined
                    }).filter(v => v != undefined)
                } as Protection
            default:
                return (equipamentos.outros?.values || []).find((v) => v.title == title) || { "title": title } as Other
        }
    }

    private static getEquipTitle(equip: Equip, qtd?: number): string {
        let title = equip.title
        if (isWeapon(equip)) {
            title += ` (${equip.uso}, ${equip.ataque}, ${equip.bonus}${equip.special ? ", " + equip.special?.map(v => v.qtd ? `${v.title} [${v.qtd}]` : v.title).join(", ") : ""}}`
        } else if (isProtection(equip)) {
            title += ` (${equip.uso}, durab. ${equip.durabilidade}${equip.special ? ", " + equip.special?.map(v => v.title).join(", ") : ""})`
        }

        return (qtd && qtd > 1 ? `${qtd}x` : "") + title
    }

    private static getEquipInvDescription(equip: EquipInv): { value: string, special?: Special[] } {
        const equipValue = this.getEquip(equip.type as "armas" | "protecao" | "outros", equip.value)
        const equipTitle = this.getEquipTitle(equipValue, equip.qtd)
        let special: Special[] = []
        if (hasSpecial(equipValue)) {
            special = equipValue.special!
        }
        return {
            value: equipTitle,
            special: special
        }
    }

    public static getEquipsDescription(equips: EquipInv[]): { title: string, description: string } {
        const equipamentos = equips.map((v) => {
            let equip = this.getEquip(v.type as "armas" | "protecao" | "outros", v.value)
            return { equip, qtd: v.qtd }
        }).reduce<{ title: string[], description: string[] }>((acc, cur) => {
            const title = cur.qtd > 1 ? `${cur.qtd} ${cur.equip.title}` : cur.equip.title
            acc.title.push(title)
            if (hasSpecial(equips)) {
                equips.special?.forEach(special => {
                    const desc = `${special.title}: ${special.description}`
                    if (!acc.description.includes(desc)) {
                        acc.description.push(desc)
                    }
                });
            }
            return acc
        }, { title: [], description: [] })
        return {
            title: equipamentos.title.join(", "),
            description: equipamentos.description.join("\n")
        }
    }

    public static generateOcupation(): Ocupation {
        const dice = randomInt(0, 5)
        return ocupacoes.ocupacao[5]
    }

    public static generateDescritor(): Descritor {
        let dice = randomInt(0, 5)
        return ocupacoes.descritor[dice]
    }

    public static generateCharacteristic(): Characteristic {
        while (true) {
            let dice = randomInt(0, 5)
            let dice2 = randomInt(0, 5)
            let value = `${dice}${dice2}`
            let charac = caracteristicas.find(v => v.value == value)
            if (charac && !charac?.reroll) {
                return {
                    title: charac.title!,
                    description: charac.description!
                }
            }

        }
    }

    public static generateName(): string {
        const dice = randomInt(0, 5)
        const dice2 = randomInt(0, 5)

        return nomes[dice][dice2];
    }
}