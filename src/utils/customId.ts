// Discord caps a component's custom_id at 100 characters, and Workers has
// nowhere to stash a session (see CLAUDE.md — no KV/D1, by design). So the
// in-progress goblin's rolled state rides along in the custom_id itself:
// Discord stores and echoes it back on the next click, we never do.
//
// Wire format (pipe-delimited, empty segments for "not chosen yet"):
//   <step>|<ocupacaoIndex>|<descritorIndex>|<caracteristica>|<equipIndex>|<atributo>|<nome>
//
// `step` says which select menu the custom_id belongs to, so the router can
// tell "equipment chosen, decode as the equip-step payload" apart from
// "attribute chosen, decode as the attr-step payload" without extra state.

export type CreationStep = "equip" | "atributo" | "magia";

export type AttrKey = "combate" | "habilidade" | "nocao" | "vitalidade";

export interface CreationState {
  ocupacaoIndex: number;
  descritorIndex: number;
  // Two concatenated d6 digits, e.g. "34" — the raw caracteristicas.json "value".
  caracteristica: string;
  nome: string;
  equipIndex?: number;
  atributo?: AttrKey;
}

const SEP = "|";

export const encodeCreationState = (
  step: CreationStep,
  state: CreationState,
): string => {
  const id = [
    step,
    state.ocupacaoIndex,
    state.descritorIndex,
    state.caracteristica,
    state.equipIndex ?? "",
    state.atributo ?? "",
    // Pipes can't appear in a name typed by a player — strip them defensively.
    state.nome.replaceAll(SEP, " "),
  ].join(SEP);

  if (id.length > 100) {
    // Should be unreachable: nome is capped at 32 chars by the slash command
    // option (max_length), and every other field is a tiny fixed code.
    throw new Error(`custom_id exceeds Discord's 100-char limit: ${id.length}`);
  }
  return id;
};

export const decodeCreationState = (
  customId: string,
): { step: CreationStep; state: CreationState } => {
  const [
    step,
    ocupacaoIndex,
    descritorIndex,
    caracteristica,
    equipIndex,
    atributo,
    ...nomeParts
  ] = customId.split(SEP);

  return {
    step: step as CreationStep,
    state: {
      ocupacaoIndex: Number(ocupacaoIndex),
      descritorIndex: Number(descritorIndex),
      caracteristica: caracteristica ?? "",
      equipIndex: equipIndex ? Number(equipIndex) : undefined,
      atributo: (atributo || undefined) as CreationState["atributo"],
      // nome may itself have contained the separator before sanitizing above;
      // rejoining defensively keeps decoding symmetric either way.
      nome: nomeParts.join(SEP),
    },
  };
};
