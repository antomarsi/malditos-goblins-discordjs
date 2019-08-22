export declare class GoblinBot {
    private client;
    private botId;
    private commands;
    private prefix;
    constructor();
    start(token: string): void;
    loadCommands(): void;
}
