/**
 * The Cloudflare Worker that answers Discord's interaction webhook.
 *
 * Discord POSTs every slash command and component click to this one URL —
 * there's no gateway connection to keep open, which is the whole reason this
 * runs on Workers instead of a long-lived discord.js process. See CLAUDE.md
 * for why there's deliberately no KV/D1 here: nothing about a goblin is
 * persisted past the response that shows it.
 */
import { AutoRouter, type IRequest } from "itty-router";
// Only verifyKey comes from discord-interactions — its enums are a separate,
// structurally-incompatible copy of the ones below, so mixing the two causes
// confusing "not assignable" errors. discord-api-types is the single source
// of truth for every wire-format type and constant here.
import { verifyKey } from "discord-interactions";
import {
  ApplicationCommandOptionType,
  ComponentType,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
  type APIApplicationCommandInteractionDataSubcommandOption,
  type APIChatInputApplicationCommandInteractionData,
  type APIInteraction,
  type APIInteractionResponse,
  type APIMessageComponentInteraction,
} from "discord-api-types/v10";
import { diceToEmoji } from "./utils/dice.js";
import { randomInt, range } from "./utils/math.js";
import {
  decodeCreationState,
  encodeCreationState,
  type AttrKey as CreationAttrKey,
} from "./utils/customId.js";
import {
  allEquipsByType,
  baseAttributes,
  caracteristicaByValue,
  descritorByIndex,
  loadoutLabel,
  magiaByType,
  magiaChoices,
  magiaResultForHits,
  ocupacaoByIndex,
  rollCaracteristica,
  rollCaracteristicaDescription,
  rollDescritorIndex,
  rollName,
  rollOcupacaoIndex,
} from "./engine/goblin.js";
import {
  atributoSelectComponent,
  creationStepEmbed,
  equipSelectComponent,
  equipSelectOptions,
  equipsEmbed,
  goblinSheetEmbed,
  magiaEmbed,
  magiaSelectComponent,
  sobreEmbed,
} from "./embeds.js";

export interface Env {
  DISCORD_APPLICATION_ID: string;
  DISCORD_PUBLIC_KEY: string;
}

class JsonResponse extends Response {
  constructor(body: unknown, init?: ResponseInit) {
    super(JSON.stringify(body), {
      headers: { "content-type": "application/json;charset=UTF-8" },
      ...init,
    });
  }
}

const respond = (response: APIInteractionResponse) =>
  new JsonResponse(response);

async function verifyDiscordRequest(request: IRequest, env: Env) {
  const signature = request.headers.get("x-signature-ed25519");
  const timestamp = request.headers.get("x-signature-timestamp");
  const body = await request.text();
  const isValid = Boolean(
    signature &&
      timestamp &&
      (await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY)),
  );
  if (!isValid) return { isValid: false as const };
  return {
    isValid: true as const,
    interaction: JSON.parse(body) as APIInteraction,
  };
}

// --- slash command option helpers ------------------------------------------------
// discord-api-types models every option kind as a discriminated union, which gets
// verbose for a handful of flat string/integer options — these two just grab the
// value by name and let the caller coerce it, rather than re-deriving the union.

const getSubcommand = (
  data: APIChatInputApplicationCommandInteractionData,
): APIApplicationCommandInteractionDataSubcommandOption => {
  const sub = data.options?.find(
    (o) => o.type === ApplicationCommandOptionType.Subcommand,
  );
  if (!sub) throw new Error("Interação sem subcomando.");
  return sub as APIApplicationCommandInteractionDataSubcommandOption;
};

const optionValue = (
  sub: APIApplicationCommandInteractionDataSubcommandOption,
  name: string,
): string | number | boolean | undefined => {
  const opt = sub.options?.find((o) => o.name === name);
  return opt && "value" in opt ? opt.value : undefined;
};

const userId = (interaction: APIInteraction): string | undefined =>
  interaction.member?.user.id ?? interaction.user?.id;

// --- /goblin subcommands ----------------------------------------------------------

function cmdCriar(sub: APIApplicationCommandInteractionDataSubcommandOption) {
  const ocupacaoIndex = rollOcupacaoIndex(Math.random);
  const descritorIndex = rollDescritorIndex(Math.random);
  const caracteristica = rollCaracteristica(Math.random);
  const nomeInformado = optionValue(sub, "nome");
  const nome =
    typeof nomeInformado === "string" && nomeInformado.trim()
      ? nomeInformado.trim()
      : rollName(Math.random);

  const ocupacao = ocupacaoByIndex(ocupacaoIndex);
  const descritor = descritorByIndex(descritorIndex);

  const customId = encodeCreationState("equip", {
    ocupacaoIndex,
    descritorIndex,
    caracteristica: caracteristica.value,
    nome,
  });

  const embed = creationStepEmbed(
    {
      nome,
      ocupacao,
      descritor,
      caracteristica,
      caracteristicaDescription: caracteristica.description ?? "",
    },
    "Selecione seu equipamento:",
  );

  return respond({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      embeds: [embed],
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            equipSelectComponent(
              customId,
              equipSelectOptions(ocupacao.equipamentos, loadoutLabel),
            ),
          ],
        },
      ],
      flags: MessageFlags.Ephemeral,
    },
  });
}

function cmdSobre() {
  const { embeds, components } = sobreEmbed();
  return respond({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { embeds, components, flags: MessageFlags.Ephemeral },
  });
}

function cmdRoll(
  sub: APIApplicationCommandInteractionDataSubcommandOption,
  interaction: APIInteraction,
) {
  const numeroDados = Number(optionValue(sub, "dados"));
  const resultados = range(0, numeroDados).map(() => randomInt(1, 6));
  const texto = resultados.map(diceToEmoji).join(" ");
  return respond({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `<@${userId(interaction)}> rolou ${numeroDados}d6 com o resultado: ${texto}`,
    },
  });
}

function cmdRollMagia(
  sub: APIApplicationCommandInteractionDataSubcommandOption,
  interaction: APIInteraction,
) {
  const numeroDados = Number(optionValue(sub, "dado-nocao"));
  const tipoMagia = String(optionValue(sub, "tipo-magia"));
  const magia = magiaByType(tipoMagia);
  if (!magia) {
    return respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "Essa magia não existe, tente novamente.",
        flags: MessageFlags.Ephemeral,
      },
    });
  }

  const dados = range(0, numeroDados).map(() => randomInt(1, 6));
  const hits = dados.filter((d) => d >= 4).length;
  const resultado = magiaResultForHits(magia, hits);

  return respond({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: [
        `<@${userId(interaction)}> rolou **${numeroDados}d6** com o resultado: ${dados.map(diceToEmoji).join(" ")}`,
        `Obteve **${hits} acertos** e a magia de ${magia.title} resultou em:`,
        `**${resultado}**`,
      ].join("\n"),
    },
  });
}

function cmdMagia(sub: APIApplicationCommandInteractionDataSubcommandOption) {
  const tipoMagia = String(optionValue(sub, "tipo-magia"));
  const magia = magiaByType(tipoMagia);
  if (!magia) {
    return respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "Essa magia não existe.",
        flags: MessageFlags.Ephemeral,
      },
    });
  }
  return respond({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { embeds: [magiaEmbed(magia)], flags: MessageFlags.Ephemeral },
  });
}

function cmdEquips(sub: APIApplicationCommandInteractionDataSubcommandOption) {
  const tipoEquip = String(optionValue(sub, "tipo-equip")) as
    | "armas"
    | "protecao"
    | "outros";
  const { items, specials } = allEquipsByType(tipoEquip);
  const titulo = { armas: "Armas", protecao: "Proteção", outros: "Outros" }[
    tipoEquip
  ];
  return respond({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      embeds: [equipsEmbed(titulo, items, specials)],
      flags: MessageFlags.Ephemeral,
    },
  });
}

async function handleCommand(interaction: APIInteraction) {
  const data =
    interaction.data as APIChatInputApplicationCommandInteractionData;
  const sub = getSubcommand(data);
  switch (sub.name) {
    case "criar":
      return cmdCriar(sub);
    case "sobre":
      return cmdSobre();
    case "roll":
      return cmdRoll(sub, interaction);
    case "roll-magia":
      return cmdRollMagia(sub, interaction);
    case "magia":
      return cmdMagia(sub);
    case "equips":
      return cmdEquips(sub);
    default:
      return respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: "Comando desconhecido.",
          flags: MessageFlags.Ephemeral,
        },
      });
  }
}

// --- /goblin criar wizard (equipamento -> atributo? -> magias? -> final) ----------

/**
 * Posts the finished goblin as a normal, non-ephemeral follow-up so the rest
 * of the channel sees it — mirroring the old "<@user> criou o seguinte
 * goblin:" reveal. Uses the webhook endpoint Discord hands every interaction
 * (application_id + interaction token), so it needs no extra secret.
 */
async function postPublicReveal(
  interaction: APIMessageComponentInteraction,
  embed: ReturnType<typeof goblinSheetEmbed>,
) {
  const url = `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}`;
  // This runs detached via ctx.waitUntil (see finalizeGoblin), so nothing
  // downstream ever sees a failure here — log it so it's at least visible
  // in `wrangler tail`, instead of a goblin silently never getting posted.
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        content: `<@${userId(interaction)}> criou o seguinte goblin:`,
        embeds: [embed],
      }),
    });
    if (!response.ok) {
      console.error(
        `postPublicReveal failed: ${response.status} ${response.statusText} — ${await response.text()}`,
      );
    }
  } catch (error) {
    console.error("postPublicReveal threw:", error);
  }
}

async function finalizeGoblin(
  interaction: APIMessageComponentInteraction,
  state: ReturnType<typeof decodeCreationState>["state"],
  ctx: ExecutionContext,
  magiaTypes?: string[],
) {
  const ocupacao = ocupacaoByIndex(state.ocupacaoIndex);
  const descritor = descritorByIndex(state.descritorIndex);
  const caracteristica = caracteristicaByValue(state.caracteristica);
  const loadout = ocupacao.equipamentos[state.equipIndex ?? 0] ?? [];
  const stats = baseAttributes(
    ocupacao,
    descritor,
    state.atributo as CreationAttrKey | undefined,
  );
  const magias = magiaTypes?.map(magiaByType).filter((m) => m !== undefined);

  const sheet = goblinSheetEmbed({
    nome: state.nome,
    ocupacao,
    descritor,
    caracteristica,
    caracteristicaDescription: rollCaracteristicaDescription(
      caracteristica,
      Math.random,
    ),
    stats,
    loadout,
    magias,
  });

  // Discord's 3-second response deadline doesn't wait for this extra network
  // hop — queue it to run after we respond instead of blocking on it. (This
  // is what was turning local "criar" finishes into ~5s "didn't respond" in
  // Discord: the fetch is slow enough on its own to blow the deadline.)
  ctx.waitUntil(postPublicReveal(interaction, sheet));

  return respond({
    type: InteractionResponseType.UpdateMessage,
    data: {
      content: "Goblin pronto! Confira abaixo. 👇",
      embeds: [],
      components: [],
    },
  });
}

async function handleComponent(
  interaction: APIMessageComponentInteraction,
  ctx: ExecutionContext,
) {
  const { step, state } = decodeCreationState(interaction.data.custom_id);
  const values = "values" in interaction.data ? interaction.data.values : [];

  const ocupacao = ocupacaoByIndex(state.ocupacaoIndex);
  const descritor = descritorByIndex(state.descritorIndex);
  const caracteristica = caracteristicaByValue(state.caracteristica);

  if (step === "equip") {
    const nextState = { ...state, equipIndex: Number(values[0]) };

    if (descritor.choose) {
      const embed = creationStepEmbed(
        {
          nome: state.nome,
          ocupacao,
          descritor,
          caracteristica,
          caracteristicaDescription: caracteristica.description ?? "",
        },
        "Seu goblin é supimpa! Escolha um atributo para ganhar +1:",
      );
      return respond({
        type: InteractionResponseType.UpdateMessage,
        data: {
          embeds: [embed],
          components: [
            {
              type: ComponentType.ActionRow,
              components: [
                atributoSelectComponent(
                  encodeCreationState("atributo", nextState),
                ),
              ],
            },
          ],
        },
      });
    }

    if (ocupacao.useMagic) {
      const embed = creationStepEmbed(
        {
          nome: state.nome,
          ocupacao,
          descritor,
          caracteristica,
          caracteristicaDescription: caracteristica.description ?? "",
        },
        `Como você é ${ocupacao.title}, selecione 3 magias:`,
      );
      return respond({
        type: InteractionResponseType.UpdateMessage,
        data: {
          embeds: [embed],
          components: [
            {
              type: ComponentType.ActionRow,
              components: [
                magiaSelectComponent(
                  encodeCreationState("magia", nextState),
                  magiaChoices(),
                ),
              ],
            },
          ],
        },
      });
    }

    return finalizeGoblin(interaction, nextState, ctx);
  }

  if (step === "atributo") {
    const nextState = { ...state, atributo: values[0] as CreationAttrKey };

    if (ocupacao.useMagic) {
      const embed = creationStepEmbed(
        {
          nome: state.nome,
          ocupacao,
          descritor,
          caracteristica,
          caracteristicaDescription: caracteristica.description ?? "",
        },
        `Como você é ${ocupacao.title}, selecione 3 magias:`,
      );
      return respond({
        type: InteractionResponseType.UpdateMessage,
        data: {
          embeds: [embed],
          components: [
            {
              type: ComponentType.ActionRow,
              components: [
                magiaSelectComponent(
                  encodeCreationState("magia", nextState),
                  magiaChoices(),
                ),
              ],
            },
          ],
        },
      });
    }

    return finalizeGoblin(interaction, nextState, ctx);
  }

  // step === 'magia'
  return finalizeGoblin(interaction, state, ctx, values);
}

// --- routing ------------------------------------------------------------------

const router = AutoRouter();

router.get(
  "/",
  (request: IRequest, env: Env) =>
    new Response(`👋 ${env.DISCORD_APPLICATION_ID}`),
);

router.post("/", async (request: IRequest, env: Env, ctx: ExecutionContext) => {
  // Goes through the exported `server` object, not the local function
  // directly, so tests can stub signature verification without a real key.
  const { isValid, interaction } = await server.verifyDiscordRequest(
    request,
    env,
  );
  if (!isValid || !interaction)
    return new Response("Bad request signature.", { status: 401 });

  if (interaction.type === InteractionType.Ping) {
    return respond({ type: InteractionResponseType.Pong });
  }
  if (interaction.type === InteractionType.ApplicationCommand) {
    return handleCommand(interaction);
  }
  if (interaction.type === InteractionType.MessageComponent) {
    return handleComponent(interaction as APIMessageComponentInteraction, ctx);
  }

  return new JsonResponse({ error: "Unknown Type" }, { status: 400 });
});

router.all("*", () => new Response("Not Found.", { status: 404 }));

const server = { verifyDiscordRequest, fetch: router.fetch };
export default server;
