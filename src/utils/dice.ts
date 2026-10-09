// Discord's number emoji only go :one: to :six:, which conveniently matches a d6.
const diceEmoji = [":one:", ":two:", ":three:", ":four:", ":five:", ":six:"];

/** value is 1-6, matching a die face. */
export const diceToEmoji = (value: number): string => {
  return diceEmoji[value - 1] ?? "🎲";
};
