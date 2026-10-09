import {
  ButtonStyle,
  ComponentType,
  type APIActionRowComponent,
  type APIButtonComponentWithURL,
  type APIComponentInMessageActionRow,
  type APIEmbed,
  type APIEmbedField,
  type APISelectMenuOption,
  type APIStringSelectComponent,
} from "discord-api-types/v10";
import type {
  Attributes,
  Caracteristica,
  Descritor,
  Magia,
  Ocupacao,
} from "./data/types.js";
import { loadoutDescription } from "./engine/goblin.js";
import type { EquipRef } from "./data/types.js";

const BRAND_COLOR = 0x4a7c2a; // goblin green

// GitHub raw URLs are free, permanent hosting for the occupation art — no
// need for Workers to serve or store the images itself.
const occupationThumbnail = (ocupacaoValue: string): string =>
  `https://raw.githubusercontent.com/antomarsi/malditos-goblins-discordjs/master/src/imgs/${ocupacaoValue}.png`;

export const sobreEmbed = (): {
  embeds: APIEmbed[];
  components: APIActionRowComponent<APIComponentInMessageActionRow>[];
} => {
  const embed: APIEmbed = {
    color: BRAND_COLOR,
    title: "Você é bem bacana em querer saber mais sobre este bot.",
    description:
      "Este é um bot criado para que todos que querem se divertir com este jogo divertido.",
    fields: [
      {
        name: "Sobre o criador",
        value:
          "Me chamo Antonio Marco (antomarsi) e gosto de programar no meu tempo vago. Este Bot é uma dessas coisas que eu criei, espero que gostem",
      },
      {
        name: "Malditos Goblins",
        value: [
          "Malditos Goblins é um mini RPG de humor.",
          "Neste jogo os jogadores interpretam goblins fracotes que morrem por qualquer coisa!",
          "Os personagens começam com suas características roladas aleatoriamente e já estão prontos para jogar!",
          "Provavelmente ele morrerá na segunda ou terceira batalha. Então você gera outro goblin e continua o jogo!",
        ].join("\n"),
      },
      {
        name: "Arte",
        value:
          "Toda arte vem do Manual oficial do Malditos Goblins, criado por Bruno Henrique Junges",
      },
    ],
  };

  const links: APIButtonComponentWithURL[] = [
    {
      type: ComponentType.Button,
      style: ButtonStyle.Link,
      label: "Quero saber mais!",
      url: "https://coisinhaverde.com.br/jogos/portfolio/malditos-goblins/",
    },
    {
      type: ComponentType.Button,
      style: ButtonStyle.Link,
      label: "GitHub",
      url: "https://github.com/antomarsi/malditos-goblins-discordjs",
    },
  ];

  return {
    embeds: [embed],
    components: [{ type: ComponentType.ActionRow, components: links }],
  };
};

export const equipSelectOptions = (
  loadouts: EquipRef[][],
  loadoutLabel: (loadout: EquipRef[]) => string,
): APISelectMenuOption[] =>
  loadouts.map((loadout, index) => ({
    label: loadoutLabel(loadout),
    value: String(index),
  }));

export const equipSelectComponent = (
  customId: string,
  options: APISelectMenuOption[],
): APIStringSelectComponent => ({
  type: ComponentType.StringSelect,
  custom_id: customId,
  placeholder: "Selecione seu equipamento",
  options,
});

export const atributoSelectComponent = (
  customId: string,
): APIStringSelectComponent => ({
  type: ComponentType.StringSelect,
  custom_id: customId,
  placeholder: "Selecione um atributo",
  options: [
    { label: "Combate", value: "combate", emoji: { name: "⚔️" } },
    { label: "Habilidade", value: "habilidade", emoji: { name: "🏃" } },
    { label: "Vitalidade", value: "vitalidade", emoji: { name: "❤️" } },
    { label: "Noção", value: "nocao", emoji: { name: "📚" } },
  ],
});

export const magiaSelectComponent = (
  customId: string,
  magias: { name: string; value: string; emoji: string }[],
): APIStringSelectComponent => ({
  type: ComponentType.StringSelect,
  custom_id: customId,
  placeholder: "Selecione 3 magias",
  min_values: 3,
  max_values: 3,
  options: magias.map((m) => ({
    label: m.name,
    value: m.value,
    emoji: { name: m.emoji },
  })),
});

interface CreationSummary {
  nome: string;
  ocupacao: Ocupacao;
  descritor: Descritor;
  caracteristica: Caracteristica;
  caracteristicaDescription: string;
}

/** The ephemeral in-progress message shown while the player is still picking equipment/atributo/magias. */
export const creationStepEmbed = (
  summary: CreationSummary,
  prompt: string,
): APIEmbed => ({
  color: BRAND_COLOR,
  title: `Seu goblin se chama ${summary.nome}`,
  description: [
    `**Ocupação:** ${summary.ocupacao.title}`,
    `**Descritor:** ${summary.descritor.title}`,
    `**${summary.caracteristica.title}:** ${summary.caracteristicaDescription}`,
    "",
    prompt,
  ].join("\n"),
});

interface FinishedGoblin extends CreationSummary {
  stats: Attributes;
  loadout: EquipRef[];
  magias?: Magia[];
}

export const goblinSheetEmbed = (goblin: FinishedGoblin): APIEmbed => {
  const statFields: APIEmbedField[] = [
    { name: "⚔️ Combate", value: String(goblin.stats.combate), inline: true },
    {
      name: "🏃 Habilidade",
      value: String(goblin.stats.habilidade),
      inline: true,
    },
    {
      name: "❤️ Vitalidade",
      value: String(goblin.stats.vitalidade),
      inline: true,
    },
    { name: "📚 Noção", value: String(goblin.stats.nocao), inline: true },
  ];

  const fields: APIEmbedField[] = [
    { name: "Nome:", value: goblin.nome, inline: true },
    { name: "Ocupação:", value: goblin.ocupacao.title, inline: true },
    { name: "Descritor:", value: goblin.descritor.title, inline: true },
    {
      name: goblin.caracteristica.title ?? "Característica",
      value: goblin.caracteristicaDescription,
    },
    ...statFields,
    {
      name: "Técnicas:",
      value: goblin.ocupacao.skills
        .map((s, i) => `- **Nível ${i + 1} - ${s.title}**: ${s.description}`)
        .join("\n"),
    },
    {
      name: "Equipamentos iniciais:",
      value: loadoutDescription(goblin.loadout),
    },
  ];

  if (goblin.magias?.length) {
    fields.push({
      name: "Magias:",
      value: goblin.magias.map((m) => m.title).join(", "),
    });
  }

  return {
    color: BRAND_COLOR,
    fields,
    thumbnail: { url: occupationThumbnail(goblin.ocupacao.value) },
    timestamp: new Date().toISOString(),
  };
};

export const equipsEmbed = (
  title: string,
  items: { title: string; description: string }[],
  specials: string[],
): APIEmbed => {
  const fields: APIEmbedField[] = items.map((i) => ({
    name: i.title,
    value: i.description || "​",
  }));
  if (specials.length)
    fields.push({
      name: "Especiais",
      value: specials.map((s) => `- ${s}`).join("\n"),
    });
  return { color: BRAND_COLOR, title, fields };
};

export const magiaEmbed = (magia: Magia): APIEmbed => {
  const hitLabels = ["0 hit", "1 hit", "2 hits", "3+ hits"];
  return {
    color: BRAND_COLOR,
    title: `Magia de ${magia.emoji} ${magia.title}`,
    description: magia.values
      .map((v, i) => `- **${hitLabels[i]}:** ${v}`)
      .join("\n"),
  };
};
