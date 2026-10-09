/**
 * One-off CLI script (`npm run register`) that pushes the command definition
 * to Discord's REST API. Not part of the deployed Worker — run by hand
 * whenever commands.ts changes, with real Node access to .env/process.env.
 */
import dotenv from "dotenv";
import process from "node:process";
import { GOBLIN_COMMAND } from "./commands.js";

dotenv.config({ path: ".env" });

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;

if (!token)
  throw new Error("A variável de ambiente DISCORD_TOKEN é obrigatória.");
if (!applicationId)
  throw new Error(
    "A variável de ambiente DISCORD_APPLICATION_ID é obrigatória.",
  );

const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;

const response = await fetch(url, {
  method: "PUT",
  headers: {
    "content-type": "application/json",
    authorization: `Bot ${token}`,
  },
  body: JSON.stringify([GOBLIN_COMMAND]),
});

if (response.ok) {
  console.log("Comandos registrados com sucesso.");
  console.log(JSON.stringify(await response.json(), null, 2));
} else {
  console.error(
    `Erro ao registrar comandos: ${response.url}: ${response.status} ${response.statusText}`,
  );
  const error = await response.text();
  if (error) console.error(error);
  process.exitCode = 1;
}
