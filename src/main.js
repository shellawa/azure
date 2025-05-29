import { Client, GatewayIntentBits } from "discord.js"
import { registerEvents } from "./handlers/eventHandler.js"

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

try {
  await registerEvents(client)
} catch (e) {
  console.error(e)
}

client.login(process.env.DISCORD_TOKEN)
