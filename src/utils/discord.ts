// discord-api-types ships its enums as one CommonJS module, so importing even a
// single runtime value from it drags ~200 KB into the worker bundle — esbuild
// can't tree-shake CJS. The worker only needs a handful of constants, so they
// live here instead, each typed as the real enum member: payloads still
// type-check against discord-api-types, which is imported with `import type`
// only (enforced by ESLint). test/discord.test.ts checks every value below
// against the real enums, so a typo here fails the test suite.
import type {
  ApplicationCommandOptionType as OptionTypeEnum,
  ApplicationCommandType as CommandTypeEnum,
  ButtonStyle as ButtonStyleEnum,
  ComponentType as ComponentTypeEnum,
  InteractionResponseType as ResponseTypeEnum,
  InteractionType as InteractionTypeEnum,
  MessageFlags as MessageFlagsEnum,
} from "discord-api-types/v10";

export const ApplicationCommandType = {
  ChatInput: 1 as CommandTypeEnum.ChatInput,
} as const;

export const ApplicationCommandOptionType = {
  Subcommand: 1 as OptionTypeEnum.Subcommand,
  String: 3 as OptionTypeEnum.String,
  Integer: 4 as OptionTypeEnum.Integer,
} as const;

export const ButtonStyle = {
  Link: 5 as ButtonStyleEnum.Link,
} as const;

export const ComponentType = {
  ActionRow: 1 as ComponentTypeEnum.ActionRow,
  Button: 2 as ComponentTypeEnum.Button,
  StringSelect: 3 as ComponentTypeEnum.StringSelect,
} as const;

export const InteractionType = {
  Ping: 1 as InteractionTypeEnum.Ping,
  ApplicationCommand: 2 as InteractionTypeEnum.ApplicationCommand,
  MessageComponent: 3 as InteractionTypeEnum.MessageComponent,
} as const;

export const InteractionResponseType = {
  Pong: 1 as ResponseTypeEnum.Pong,
  ChannelMessageWithSource: 4 as ResponseTypeEnum.ChannelMessageWithSource,
  UpdateMessage: 7 as ResponseTypeEnum.UpdateMessage,
} as const;

export const MessageFlags = {
  Ephemeral: 64 as MessageFlagsEnum.Ephemeral,
} as const;
