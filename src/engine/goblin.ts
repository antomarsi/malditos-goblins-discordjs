import ocupacoesData from "../data/ocupacoes.json" with { type: "json" };
import caracteristicasData from "../data/caracteristicas.json" with { type: "json" };
import equipamentosData from "../data/equipamentos.json" with { type: "json" };
import magiasData from "../data/magias.json" with { type: "json" };
import nomesData from "../data/nomes.json" with { type: "json" };
import type {
  Arma,
  Attributes,
  Caracteristica,
  EquipamentosData,
  EquipRef,
  EquipSpecialRef,
  EquipTipo,
  Magia,
  Ocupacao,
  OcupacoesData,
  Protecao,
} from "../data/types.js";
import { randomInt, type Rng } from "../utils/math.js";

const ocupacoes = ocupacoesData as OcupacoesData;
const caracteristicas = caracteristicasData as Caracteristica[];
const equipamentos = equipamentosData as EquipamentosData;
const magias = magiasData as Magia[];
const nomes = nomesData as string[][];

const ATTR_KEYS = ["combate", "habilidade", "nocao", "vitalidade"] as const;
export type AttrKey = (typeof ATTR_KEYS)[number];

export const ocupacaoByIndex = (index: number): Ocupacao => {
  const ocupacao = ocupacoes.ocupacao[index];
  if (!ocupacao) throw new Error(`Ocupação inválida: ${index}`);
  return ocupacao;
};

export const descritorByIndex = (index: number) => {
  const descritor = ocupacoes.descritor[index];
  if (!descritor) throw new Error(`Descritor inválido: ${index}`);
  return descritor;
};

export const rollOcupacaoIndex = (rng: Rng): number => randomInt(0, 5, rng);
export const rollDescritorIndex = (rng: Rng): number => randomInt(0, 5, rng);

/**
 * caracteristicas.json keys its rows by two concatenated d6 digits ("34", not
 * array index 3), and a handful of rows are "role 2 vezes" — reroll entries.
 * The legacy code rolled 0-5 here, which never matched any 1-6 keyed row;
 * this rolls an actual d6 pair and loops past reroll entries, as the
 * rulebook describes.
 */
export const rollCaracteristica = (rng: Rng): Caracteristica => {
  for (;;) {
    const value = `${randomInt(1, 6, rng)}${randomInt(1, 6, rng)}`;
    const found = caracteristicas.find((c) => c.value === value);
    if (found && !found.reroll) return found;
  }
};

export const caracteristicaByValue = (value: string): Caracteristica => {
  const found = caracteristicas.find((c) => c.value === value);
  if (!found) throw new Error(`Característica inválida: ${value}`);
  return found;
};

/** Substitutes the literal "1d6" some characteristic text contains with an actual roll. */
export const rollCaracteristicaDescription = (
  caracteristica: Caracteristica,
  rng: Rng,
): string => {
  const description = caracteristica.description ?? "";
  return description.replaceAll("1d6", String(randomInt(1, 6, rng)));
};

/**
 * The name table's last row is "[Última coisa que vc comeu]" / "[Inverta seu
 * nome]" — prompts for the player to improvise, not an actual name. There's
 * no interactive follow-up in this bot (nome is a plain command option), so
 * an auto-roll that lands there just rerolls instead of handing back a
 * literal prompt string as someone's name.
 */
export const rollName = (rng: Rng): string => {
  const specialRow = nomes.length - 1;
  for (;;) {
    const row = randomInt(0, 5, rng);
    if (row === specialRow) continue;
    const col = randomInt(0, 5, rng);
    const candidate = nomes[row]?.[col];
    if (candidate) return candidate;
  }
};

export const baseAttributes = (
  ocupacao: Ocupacao,
  descritor: { stats: Attributes },
  bonus?: AttrKey,
): Attributes => {
  const result = {} as Attributes;
  for (const key of ATTR_KEYS) {
    result[key] =
      2 + ocupacao.stats[key] + descritor.stats[key] + (key === bonus ? 1 : 0);
  }
  return result;
};

export const findArma = (title: string): Arma | undefined =>
  equipamentos.armas.values.find((a) => a.title === title);
export const findProtecao = (title: string): Protecao | undefined =>
  equipamentos.protecao.values.find((p) => p.title === title);
export const findOutro = (title: string) =>
  equipamentos.outros.values.find((o) => o.title === title);

const describeSpecials = (
  special: EquipSpecialRef[] | undefined,
): string | undefined =>
  special?.map((s) => (s.qtd ? `${s.type} [${s.qtd}]` : s.type)).join(", ");

const describeArma = (arma: Arma): string =>
  `${arma.uso}, ${arma.ataque}, ${arma.bonus}${describeSpecials(arma.special) ? `, ${describeSpecials(arma.special)}` : ""}`;

const describeProtecao = (protecao: Protecao): string =>
  `${protecao.uso}, durab. ${protecao.durabilidade}${describeSpecials(protecao.special) ? `, ${describeSpecials(protecao.special)}` : ""}`;

/** Resolves one equipment-loadout line (from ocupacoes.json) to a display title + description. */
const describeEquipRef = (
  ref: EquipRef,
): { title: string; description: string } => {
  const prefix = ref.qtd > 1 ? `${ref.qtd}x ` : "";
  if (ref.type === "armas") {
    const arma = findArma(ref.value);
    return {
      title: `${prefix}${arma?.title ?? ref.value}`,
      description: arma ? describeArma(arma) : "",
    };
  }
  if (ref.type === "protecao") {
    const protecao = findProtecao(ref.value);
    return {
      title: `${prefix}${protecao?.title ?? ref.value}`,
      description: protecao ? describeProtecao(protecao) : "",
    };
  }
  const outro = findOutro(ref.value);
  return {
    title: `${prefix}${ref.value}`,
    description: outro?.description ?? "",
  };
};

/** Short label for the "Escolha seu equipamento" select menu option. */
export const loadoutLabel = (loadout: EquipRef[]): string =>
  loadout
    .map((ref) => `${ref.qtd > 1 ? `${ref.qtd}x ` : ""}${ref.value}`)
    .join(", ");

/** Full "Equipamentos iniciais" field text for the finished character sheet. */
export const loadoutDescription = (loadout: EquipRef[]): string =>
  loadout
    .map((ref) => describeEquipRef(ref))
    .map(({ title, description }) => `- **${title}**: ${description}`)
    .join("\n");

export const allEquipsByType = (
  tipo: EquipTipo,
): { items: { title: string; description: string }[]; specials: string[] } => {
  if (tipo === "outros") {
    return {
      items: equipamentos.outros.values.map((v) => ({
        title: v.title,
        description: v.description,
      })),
      specials: [],
    };
  }

  const group = equipamentos[tipo];
  const items = group.values.map((v) => ({
    title: v.title,
    description:
      tipo === "armas"
        ? describeArma(v as Arma)
        : describeProtecao(v as Protecao),
  }));
  return {
    items,
    specials: group.specials.map((s) => `**${s.title}**: ${s.description}`),
  };
};

export const magiaByType = (type: string): Magia | undefined =>
  magias.find((m) => m.type === type);

export const magiaChoices = (): {
  name: string;
  value: string;
  emoji: string;
}[] => magias.map((m) => ({ name: m.title, value: m.type, emoji: m.emoji }));

/**
 * values has 4 entries: hits 0, 1, 2, "3 ou mais". The legacy code returned
 * values[2] for any hits >= 3, silently reusing the 2-hit result instead of
 * the 3+ one — fixed here to index values[3] once hits crosses that line.
 */
export const magiaResultForHits = (magia: Magia, hits: number): string => {
  const index = Math.min(Math.max(hits, 0), 3);
  // Clamped to 0-3 above, so this is always one of the tuple's 4 entries —
  // noUncheckedIndexedAccess can't see that from a computed index, though.
  return magia.values[index]!;
};
