// Shapes of the JSON tables under src/data/, transcribed from the rulebook.
// These are plain data files, not generated from a schema, so the fields
// below just describe what's actually there.

export interface Attributes {
  combate: number;
  habilidade: number;
  nocao: number;
  vitalidade: number;
}

export interface Skill {
  title: string;
  description: string;
}

export type EquipTipo = "armas" | "protecao" | "outros";

export interface EquipRef {
  type: EquipTipo;
  value: string;
  qtd: number;
}

export interface Ocupacao {
  title: string;
  value: string;
  stats: Attributes;
  useMagic?: boolean;
  skills: Skill[];
  // Each inner array is one of the "Equipamento (Escolha)" loadout options.
  equipamentos: EquipRef[][];
}

export interface Descritor {
  title: string;
  value: string;
  // Only "Supimpa" sets this — the player picks which attribute gets +1.
  choose?: boolean;
  stats: Attributes;
}

export interface OcupacoesData {
  ocupacao: Ocupacao[];
  descritor: Descritor[];
}

export interface Caracteristica {
  // Two concatenated d6 digits, e.g. "34" — not the array index.
  value: string;
  title?: string;
  description?: string;
  // "Role 2 vezes" entries: no title/description, roll again.
  reroll?: boolean;
}

export interface Magia {
  title: string;
  emoji: string;
  type: string;
  // Index 0-2 = that many hits, index 3 = "3 ou mais hits".
  values: [string, string, string, string];
}

export interface EquipSpecialRef {
  type: string;
  qtd?: number;
}

export interface EquipSpecialDef {
  title: string;
  description: string;
}

export interface Arma {
  title: string;
  uso: string;
  ataque: string;
  bonus: string;
  special?: EquipSpecialRef[];
}

export interface Protecao {
  title: string;
  uso: string;
  durabilidade: number;
  special?: EquipSpecialRef[];
}

export interface Outro {
  title: string;
  description: string;
}

export interface EquipamentosData {
  armas: { values: Arma[]; specials: EquipSpecialDef[] };
  protecao: { values: Protecao[]; specials: EquipSpecialDef[] };
  outros: { values: Outro[] };
}
