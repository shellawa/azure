import { Client } from "discord.js"
import fs from "fs"
import path from "path"
import { fileURLToPath, pathToFileURL } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Register event listeners.
 * @param {Client} client
 */
export const registerEvents = async client => {
  const eventFolder = path.join(__dirname, "..", "events")

  const events = fs
    .readdirSync(eventFolder, { withFileTypes: true })
    .filter(item => !item.isDirectory() && item.name.endsWith(".js"))
    .map(item => item.name.slice(0, -3))
    .sort()

  for (const eventName of events) {
    try {
      const { name, listener } = await import(pathToFileURL(path.join(eventFolder, eventName) + ".js").href)
      client.on(name, listener)
    } catch (e) {
      console.error(`❌ Failed to load event "${eventName}.js":`, e)
    }
  }
}
