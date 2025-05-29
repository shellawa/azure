import { Client, Collection, REST, Routes } from "discord.js"
import fs from "fs"
import path from "path"
import { fileURLToPath, pathToFileURL } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Register interactions.
 * @param {Client} client
 */
export const registerInteractions = async client => {
  const interactionFolder = path.join(__dirname, "..", "interactions")

  const interactions = fs
    .readdirSync(interactionFolder, { withFileTypes: true })
    .filter(item => !item.isDirectory() && item.name.endsWith(".js"))
    .map(item => item.name.slice(0, -3))
    .sort()

  client.commands = new Collection()
  const globalCommands = []

  for (const interactionName of interactions) {
    try {
      const { data, execute, isGlobal } = await import(pathToFileURL(path.join(interactionFolder, interactionName) + ".js").href)
      client.commands.set(data.name, { data, execute })
      if (isGlobal) globalCommands.push(data)
      console.log(`✅ Registered interaction: ${data.name}`)
    } catch (e) {
      console.error(`❌ Failed to load interaction "${interactionName}.js":`, e)
    }
  }

  if (globalCommands.length) {
    const rest = new REST().setToken(process.env.DISCORD_TOKEN)
    try {
      await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: globalCommands })
      console.log(`🚀 Registered ${globalCommands.length} global command(s).`)
    } catch (e) {
      console.error("❌ Failed to register global commands:", e)
    }
  }
}
