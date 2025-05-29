import { SlashCommandBuilder } from "discord.js"

export const data = new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!")
export const isGlobal = true

/**
 * @param {import("discord.js").Interaction} interaction
 */
export const execute = async interaction => {
  await interaction.reply("Pong!")
}
