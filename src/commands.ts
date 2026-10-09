import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  type RESTPostAPIApplicationCommandsJSONBody,
} from "discord-api-types/v10";
import { magiaChoices } from "./engine/goblin.js";

const tipoMagiaChoices = magiaChoices().map((m) => ({
  name: m.name,
  value: m.value,
}));

const tipoEquipChoices = [
  { name: "Armas", value: "armas" },
  { name: "Proteção", value: "protecao" },
  { name: "Outros", value: "outros" },
];

/**
 * One command with subcommands, matching how the legacy discord.js bot was
 * laid out. commands.ts is the single source shared by register.ts (sends
 * this to Discord's REST API) and server.ts (reads option names back out of
 * the interaction payload it receives).
 */
export const GOBLIN_COMMAND: RESTPostAPIApplicationCommandsJSONBody = {
  name: "goblin",
  description: "Gerenciador do bot Malditos Goblins",
  type: ApplicationCommandType.ChatInput,
  dm_permission: false,
  options: [
    {
      name: "criar",
      description: "Cria um novo goblin",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "nome",
          description: "Nome do goblin (deixe em branco para rolar um nome)",
          type: ApplicationCommandOptionType.String,
          max_length: 32,
        },
      ],
    },
    {
      name: "sobre",
      description: "Saiba mais sobre o bot",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "roll",
      description: "Joga seus dados, boa sorte",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "dados",
          description: "Número de dados",
          type: ApplicationCommandOptionType.Integer,
          required: true,
          min_value: 1,
        },
      ],
    },
    {
      name: "roll-magia",
      description: "Joga seus dados, para testar sua magia",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "tipo-magia",
          description: "Qual o tipo de magia",
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: tipoMagiaChoices,
        },
        {
          name: "dado-nocao",
          description: "O seu valor de Noção",
          type: ApplicationCommandOptionType.Integer,
          required: true,
          min_value: 1,
        },
      ],
    },
    {
      name: "magia",
      description: "Mostra a lista de magias",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "tipo-magia",
          description: "Lista de magias",
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: tipoMagiaChoices,
        },
      ],
    },
    {
      name: "equips",
      description: "Lista de equipamentos que os goblins podem encontrar",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "tipo-equip",
          description: "Categoria de equipamento",
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: tipoEquipChoices,
        },
      ],
    },
  ],
};
