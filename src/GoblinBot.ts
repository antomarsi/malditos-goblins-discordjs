import { Client } from "discord.js";
import GoblinCommand from "./Commands/GoblinCommand";
import { logEvent, logError, logWarn } from "./Log";
import { ICommand } from "./Commands/index";

export class GoblinBot {
  private client: Client = new Client();
  private botId: string;
  private commands: ICommand[] = [];
  private prefix: string = "~goblin";

  constructor() {
    logEvent("Loading commands");
    this.loadCommands();
  }

  public start(token: string): void {
    console.log("Starting bot...");

    this.client.on("ready", () => {
      this.botId = this.client.user.id;
      logEvent(`Bot Connected.`);
      logEvent(`Logged in as ${this.client.user.tag}`);
      this.client.user.setActivity("Use ~goblin ajuda");
      console.log("Bot Connected.");
    });

    this.client.on("message", msg => {
      if (msg.content.startsWith(this.prefix)) {
        logEvent(`Command Accepted: ${msg.content}`);
        this.commands.some(command => {
          return command.process(msg);
        });
      }
    });

    this.client.on("error", logError);

    this.client.on("warn", logWarn);

    process.on("exit", () => {
      logEvent(`Bot Process exit.`);
      this.client.destroy();
    });

    process.on("uncaughtException", (err: Error) => {
      const errorMsg = (err ? err.stack || err : "")
        .toString()
        .replace(new RegExp(`${__dirname}\/`, "g"), "./");
      logError(errorMsg);
    });

    this.client.login(token);
  }

  loadCommands() {
    this.commands.push(new GoblinCommand());
  }
}
