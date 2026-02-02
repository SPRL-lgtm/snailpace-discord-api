import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

let ready = false;
let cachedCount = null;
let cachedAt = 0;

async function startBot() {
  if (ready) return;
  await client.login(process.env.DISCORD_TOKEN);
  ready = true;
}

export default async function handler(req, res) {
  try {
    await startBot();
    if (cachedCount && Date.now() - cachedAt < 60000) {
      return res.status(200).json({ members: cachedCount });
    }
    const guild = await client.guilds.fetch("1183064144333787257");
    const count = guild.memberCount;
    cachedCount = count;
    cachedAt = Date.now();
    res.status(200).json({ members: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Discord API error" });
  }
}

