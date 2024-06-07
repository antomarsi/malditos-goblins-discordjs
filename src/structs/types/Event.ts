import { ClientEvents } from "discord.js";

export type EventType<k extends keyof ClientEvents> = {
    name: k,
    once?: boolean,
    run(...arg: ClientEvents[k]): any
}

export class Event<k extends keyof ClientEvents> {
    constructor(options: EventType<k>) {
        Object.assign(this, options)
    }
}