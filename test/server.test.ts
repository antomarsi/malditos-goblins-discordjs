import { expect } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import { InteractionResponseType, InteractionType } from "discord-interactions";
import { ComponentType } from "discord-api-types/v10";
import server from "../src/server.js";

const env = {
  DISCORD_APPLICATION_ID: "123456789",
  DISCORD_PUBLIC_KEY: "unused-in-tests",
};

const postRequest = (body: unknown) => ({
  method: "POST",
  url: new URL("/", "http://discordo.example").toString(),
  json: async () => body,
});

describe("server", () => {
  describe("GET /", () => {
    it("greets with the application id", async () => {
      const request = {
        method: "GET",
        url: new URL("/", "http://discordo.example").toString(),
      };
      const response = await server.fetch(request, env);
      expect(await response.text()).to.equal("👋 123456789");
    });
  });

  describe("interactions", () => {
    let verifyStub: sinon.SinonStub;

    beforeEach(() => {
      // The signature check itself is Discord's library, not our logic —
      // stubbed out so tests can hand in arbitrary interaction payloads.
      verifyStub = sinon.stub(server, "verifyDiscordRequest");
    });

    afterEach(() => {
      verifyStub.restore();
      sinon.restore();
    });

    const stubInteraction = (interaction: unknown) => {
      verifyStub.resolves({ isValid: true, interaction });
    };

    it("answers PING with PONG", async () => {
      stubInteraction({ type: InteractionType.PING });
      const response = await server.fetch(postRequest({}), env);
      const body = await response.json();
      expect(body.type).to.equal(InteractionResponseType.PONG);
    });

    it("rejects an invalid signature", async () => {
      verifyStub.resolves({ isValid: false });
      const response = await server.fetch(postRequest({}), env);
      expect(response.status).to.equal(401);
    });

    const chatInput = (
      subName: string,
      options: { name: string; value: string | number }[] = [],
    ) => ({
      type: InteractionType.APPLICATION_COMMAND,
      application_id: "app-id",
      token: "interaction-token",
      user: { id: "user-id" },
      data: { name: "goblin", options: [{ type: 1, name: subName, options }] },
    });

    it("/goblin sobre replies with an about embed", async () => {
      stubInteraction(chatInput("sobre"));
      const response = await server.fetch(postRequest({}), env);
      const body = await response.json();
      expect(body.data.embeds[0].title).to.include("bacana");
    });

    it("/goblin roll rolls the requested number of d6", async () => {
      sinon.stub(Math, "random").returns(0); // every die lands on face 1
      stubInteraction(chatInput("roll", [{ name: "dados", value: 3 }]));
      const response = await server.fetch(postRequest({}), env);
      const body = await response.json();
      expect(body.data.content).to.include("3d6");
      expect((body.data.content.match(/:one:/g) ?? []).length).to.equal(3);
    });

    it("/goblin magia shows the hit table for a spell", async () => {
      stubInteraction(
        chatInput("magia", [{ name: "tipo-magia", value: "fogo" }]),
      );
      const response = await server.fetch(postRequest({}), env);
      const body = await response.json();
      expect(body.data.embeds[0].title).to.include("Fogo");
    });

    it("/goblin roll-magia counts hits and resolves the spell result", async () => {
      sinon.stub(Math, "random").returns(0); // both dice roll 1, so 0 hits (need >= 4 to count)
      stubInteraction(
        chatInput("roll-magia", [
          { name: "tipo-magia", value: "fogo" },
          { name: "dado-nocao", value: 2 },
        ]),
      );
      const response = await server.fetch(postRequest({}), env);
      const body = await response.json();
      expect(body.data.content).to.include("0 acertos");
      expect(body.data.content).to.include("queima seu rosto"); // the 0-hit Fogo result
    });

    it("/goblin equips lists one category", async () => {
      stubInteraction(
        chatInput("equips", [{ name: "tipo-equip", value: "armas" }]),
      );
      const response = await server.fetch(postRequest({}), env);
      const body = await response.json();
      expect(body.data.embeds[0].title).to.equal("Armas");
      expect(body.data.embeds[0].fields.length).to.be.greaterThan(0);
    });
  });

  describe("/goblin criar wizard", () => {
    let verifyStub: sinon.SinonStub;
    let fetchStub: sinon.SinonStub;

    beforeEach(() => {
      verifyStub = sinon.stub(server, "verifyDiscordRequest");
      fetchStub = sinon.stub(globalThis, "fetch").resolves(new Response("{}"));
    });

    afterEach(() => {
      sinon.restore();
    });

    const stubInteraction = (interaction: unknown) =>
      verifyStub.resolves({ isValid: true, interaction });
    const criarInteraction = (nome: string) => ({
      type: InteractionType.APPLICATION_COMMAND,
      application_id: "app-id",
      token: "interaction-token",
      user: { id: "user-id" },
      data: {
        name: "goblin",
        options: [
          { type: 1, name: "criar", options: [{ name: "nome", value: nome }] },
        ],
      },
    });
    const componentInteraction = (customId: string, values: string[]) => ({
      type: InteractionType.MESSAGE_COMPONENT,
      application_id: "app-id",
      token: "interaction-token",
      user: { id: "user-id" },
      data: { custom_id: customId, values },
    });
    const equipCustomId = (response: {
      data: { components: { components: { custom_id: string }[] }[] };
    }) => response.data.components[0]!.components[0]!.custom_id;

    it("finalizes immediately for an occupation with no extra choices", async () => {
      // rng = 0 throughout: ocupação index 0 (Mercenário, no magic), descritor
      // index 0 (Covarde, not Supimpa), característica "11" (Bomba-relógio,
      // not a reroll entry) — a fully deterministic no-branch run.
      sinon.stub(Math, "random").returns(0);
      stubInteraction(criarInteraction("Nhack"));
      const criarResponse = await server
        .fetch(postRequest({}), env)
        .then((r) => r.json());
      expect(criarResponse.data.components[0].components[0].type).to.equal(
        ComponentType.StringSelect,
      );

      stubInteraction(
        componentInteraction(equipCustomId(criarResponse), ["0"]),
      );
      const finalResponse = await server
        .fetch(postRequest({}), env)
        .then((r) => r.json());

      expect(finalResponse.type).to.equal(
        InteractionResponseType.UPDATE_MESSAGE,
      );
      expect(fetchStub.calledOnce).to.equal(true);
      const [, init] = fetchStub.firstCall.args;
      const posted = JSON.parse(init.body);
      expect(posted.content).to.include("<@user-id> criou o seguinte goblin");
      expect(
        posted.embeds[0].fields.find(
          (f: { name: string }) => f.name === "Nome:",
        ).value,
      ).to.equal("Nhack");
    });

    it("asks for an attribute bonus when the descritor is Supimpa", async () => {
      // call 0 -> ocupação index 0 (Mercenário); call 1 -> 0.99 pushes
      // descritor index to 5 (Supimpa); calls 2-3 -> característica "11".
      const rng = sinon.stub(Math, "random");
      rng.onCall(1).returns(0.99);
      rng.returns(0);

      stubInteraction(criarInteraction("Nhack"));
      const criarResponse = await server
        .fetch(postRequest({}), env)
        .then((r) => r.json());

      stubInteraction(
        componentInteraction(equipCustomId(criarResponse), ["0"]),
      );
      const attrStepResponse = await server
        .fetch(postRequest({}), env)
        .then((r) => r.json());
      expect(attrStepResponse.type).to.equal(
        InteractionResponseType.UPDATE_MESSAGE,
      );
      expect(
        attrStepResponse.data.components[0].components[0].options.map(
          (o: { value: string }) => o.value,
        ),
      ).to.include("combate");

      stubInteraction(
        componentInteraction(equipCustomId(attrStepResponse), ["combate"]),
      );
      await server.fetch(postRequest({}), env);
      const [, init] = fetchStub.firstCall.args;
      const posted = JSON.parse(init.body);
      // base 2 + ocupação Mercenário combate(+1) + Supimpa bonus(+1) = 4
      expect(
        posted.embeds[0].fields.find(
          (f: { name: string }) => f.name === "⚔️ Combate",
        ).value,
      ).to.equal("4");
    });

    it("asks for 3 spells when the occupation is Bruxo", async () => {
      // call 0 -> 0.99 pushes ocupação index to 5 (Bruxo); call 1 -> 0 keeps
      // descritor at index 0 (Covarde); calls 2-3 -> característica "11".
      const rng = sinon.stub(Math, "random");
      rng.onCall(0).returns(0.99);
      rng.returns(0);

      stubInteraction(criarInteraction("Nhack"));
      const criarResponse = await server
        .fetch(postRequest({}), env)
        .then((r) => r.json());

      stubInteraction(
        componentInteraction(equipCustomId(criarResponse), ["0"]),
      );
      const magiaStepResponse = await server
        .fetch(postRequest({}), env)
        .then((r) => r.json());
      expect(
        magiaStepResponse.data.components[0].components[0].min_values,
      ).to.equal(3);

      stubInteraction(
        componentInteraction(equipCustomId(magiaStepResponse), [
          "fogo",
          "gelo",
          "cura",
        ]),
      );
      await server.fetch(postRequest({}), env);
      const [, init] = fetchStub.firstCall.args;
      const posted = JSON.parse(init.body);
      expect(
        posted.embeds[0].fields.find(
          (f: { name: string }) => f.name === "Magias:",
        ).value,
      ).to.equal("Fogo, Gelo, Cura");
    });
  });
});
