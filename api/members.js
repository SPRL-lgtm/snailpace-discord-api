import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

let cachedCount = null;
let cachedAt = 0;

export default async function handler(req, res) {
  try {
    // Cache 60 Sekunden
    if (cachedCount && Date.now() - cachedAt < 60000) {
      return res.status(200).json({ members: cachedCount });
    }

    if (!client.isReady()) {
      await client.login(process.env.DISCORD_TOKEN);
    }

    const guild = await client.guilds.fetch("1183064144333787257");
    const count = guild.memberCount;

    cachedCount = count;
    cachedAt = Date.now();

    res.status(200).json({ members: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Discord API error" });
  }
}
