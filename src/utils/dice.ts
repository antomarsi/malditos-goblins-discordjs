
const dices = [
    ":one:",
    ":two:",
    ":three:",
    ":four:",
    ":five:",
    ":six:",
]

export const diceToEmoji = (value: number): string => {
    return dices[value]
}