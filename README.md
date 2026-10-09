# Malditos Goblins Bot

A Discord bot for [**Malditos Goblins**](https://coisinhaverde.com.br/jogos/portfolio/malditos-goblins/), a Brazilian
humor mini-RPG where players roll up fragile goblins who die constantly and get replaced. The bot rolls your goblin
for you: occupation, descriptor, quirky characteristic, stats, equipment and (if you roll a Bruxo) spells — following
the character creation rules from the official rulebook.

It runs as a [Cloudflare Worker](https://workers.cloudflare.com/), answering Discord's interaction webhook instead of
keeping a gateway connection open. That's a deliberate choice: Workers' free tier easily covers this bot (plain table
lookups and dice rolls, no persistent connection, no stored data), so it can be hosted indefinitely at no cost. See
"Hosting cost" below — and see [`PRIVACY.md`](./PRIVACY.md) / [`TERMS.md`](./TERMS.md) for what that "no stored data"
design means in privacy terms (both are usable as the Privacy Policy / Terms of Service URLs in the Discord
Developer Portal, pointed at each file's raw GitHub URL).

## Commands

- `/goblin criar [nome]` — rolls a new goblin. You'll be asked to pick an equipment loadout, and — only when it
  applies — which attribute gets +1 (Supimpa descriptor) or which 3 spells to learn (Bruxo occupation). Nothing about
  the goblin is saved anywhere; the result is just the message Discord shows.
- `/goblin sobre` — about the bot.
- `/goblin roll dados:<n>` — rolls N d6.
- `/goblin roll-magia tipo-magia:<tipo> dado-nocao:<n>` — rolls your Noção dice and resolves a spell's result.
- `/goblin magia tipo-magia:<tipo>` — shows a spell's full hit table.
- `/goblin equips tipo-equip:<armas|protecao|outros>` — lists equipment of one category.

## Project structure

```
├── .github/workflows/ci.yaml  -> lint + test on every push/PR, deploy on push to master
├── src
│   ├── server.ts               -> the Worker: verifies Discord's signature, routes interactions
│   ├── commands.ts              -> the /goblin command definition (shared by server.ts and register.ts)
│   ├── register.ts              -> one-off script that registers commands with Discord's API
│   ├── embeds.ts                 -> builds the Discord embed/component payloads
│   ├── engine/goblin.ts           -> game logic: rolling, stats, equipment/spell lookups
│   ├── utils/                      -> small helpers (dice emoji, RNG, custom_id encoding)
│   ├── data/*.json                  -> the rulebook's tables (occupations, spells, equipment, names…)
│   └── imgs/*.png                    -> occupation art, served via raw GitHub URLs in embeds
├── test/server.test.ts         -> mocha/chai/sinon tests
├── wrangler.toml               -> Cloudflare Worker config
└── package.json
```

## Setup

You'll need a [Discord application](https://discord.com/developers/applications) with:

- A bot user with the `Send Messages` and `Use Slash Command` permissions.
- The `applications.commands` scope enabled.

> Generate an install link from the app's `OAuth2` → `URL Generator` tab with those permissions/scope checked, then
> open that URL to add the bot to a server.

You'll also want a [Cloudflare account](https://dash.cloudflare.com/) — the free plan is all this needs.

## Running locally

```
npm install
```

> Requires Node.js 18+.

### Local configuration

Two separate env files are used, because they feed two different things:

- **`.dev.vars`** — read by `wrangler dev` (the Worker itself, at runtime). Create it with:
  ```
  DISCORD_PUBLIC_KEY=your-app-public-key
  DISCORD_APPLICATION_ID=your-app-id
  ```
- **`.env`** — read by `register.ts`, a plain Node script (not part of the Worker) that pushes command definitions
  to Discord. Copy `.env.example` to `.env` and fill in:
  ```
  DISCORD_APPLICATION_ID=your-app-id
  DISCORD_PUBLIC_KEY=your-app-public-key
  DISCORD_TOKEN=your-bot-token
  ```

Both files are gitignored — never commit real credentials.

### Register commands

Only needs to run once, or again whenever `src/commands.ts` changes:

```
npm run register
```

### Run the Worker

```
npm start
```

This starts `wrangler dev`, serving the Worker locally (default `http://localhost:8787`).

### Exposing it to Discord with ngrok

Discord needs a public HTTPS URL to send interactions to, so tunnel your local server. This needs the
[ngrok CLI](https://ngrok.com/download) installed separately (it's not an npm dependency — the old `ngrok` npm
package was an unmaintained wrapper around it, pulled in several vulnerable transitive dependencies, and added
nothing `npm run ngrok` actually needs beyond having `ngrok` itself on your `PATH`):

```
npm run ngrok
```

Copy the `https://…ngrok…` URL it prints, then paste it into your Discord application's **Interactions Endpoint
URL** field (General Information tab). Discord will immediately send a `PING` to verify it — if `wrangler dev` is
running, it should go green.

With that in place, slash commands typed in any server the bot is in will hit your local machine.

### Checks

```
npm run typecheck   # tsc --noEmit
npm run lint         # eslint
npm test              # mocha + c8 coverage
```

## Deploying

```
npm run publish
```

This runs `wrangler deploy`. `.github/workflows/ci.yaml` also does this automatically on every push to `master`
(after lint + test pass), using `CF_API_TOKEN`/`CF_ACCOUNT_ID` repository secrets — see
[Cloudflare's token docs](https://developers.cloudflare.com/workers/wrangler/ci-cd/) for generating those.

Once deployed, update the Discord application's Interactions Endpoint URL to the Worker's `*.workers.dev` URL (or a
custom domain), instead of the ngrok tunnel.

### Secrets in production

`.dev.vars` only applies locally. For the deployed Worker:

```
wrangler secret put DISCORD_PUBLIC_KEY
wrangler secret put DISCORD_APPLICATION_ID
```

(`DISCORD_TOKEN` isn't needed in production — the Worker itself never calls Discord's REST API with the bot token;
only the local `register.ts` script does.)

## Hosting cost

This bot is designed to run **free, indefinitely**, on Cloudflare Workers' free plan:

- Every request is a plain JSON table lookup or dice roll — negligible CPU, well under the free plan's per-request
  limit.
- No database, no KV, no Durable Objects — nothing about a generated goblin is stored anywhere, by design (goblins
  die constantly in this game; regenerating one is the normal flow, not something worth persisting). `wrangler.toml`
  has no bindings, which is the simplest way to confirm that's still true.
- Discord only calls the Worker when someone actually uses a command — there's no polling or background work.

If Cloudflare Workers' free tier ever stops fitting (policy changes, traffic genuinely grows past it), the Worker is
just a signed-webhook `fetch` handler with no Workers-specific APIs, so it would port with minimal changes to any
similar edge/serverless platform with a free tier (e.g. Deno Deploy, Vercel Edge Functions, Netlify Edge Functions) —
avoid anything that "sleeps" on its free tier, since Discord requires a response within 3 seconds.
