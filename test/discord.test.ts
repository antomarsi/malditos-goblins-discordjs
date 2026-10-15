import { expect } from "chai";
import { describe, it } from "mocha";
import * as real from "discord-api-types/v10";
import * as local from "../src/utils/discord.js";

// src/utils/discord.ts hand-copies a few discord-api-types enum values to keep
// the worker bundle small. The `as` casts there would happily accept a wrong
// number, so this checks every copied value against the real enum.
describe("utils/discord constants", () => {
  for (const [enumName, members] of Object.entries(local)) {
    const realEnum = real[enumName as keyof typeof real] as Record<
      string,
      unknown
    >;

    it(`${enumName} matches discord-api-types`, () => {
      expect(realEnum, `${enumName} not found in discord-api-types`).to.be.an(
        "object",
      );
      for (const [member, value] of Object.entries(members)) {
        expect(value, `${enumName}.${member}`).to.equal(realEnum[member]);
      }
    });
  }
});
