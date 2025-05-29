import { Client, Events } from "discord.js"
import { registerInteractions } from "../handlers/interactionHandler.js"

export const name = Events.ClientReady

/**
 * @param {Client} client
 */
export const listener = async client => {
  console.log(`Logged in to ${client.user.tag}`)
  await registerInteractions(client)
}
