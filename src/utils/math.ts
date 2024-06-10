export const randomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
export const Range = (start: number, end: number): number[] => {
    return Array.from({ length: (end - start) }, (v, k) => k + start);
}
