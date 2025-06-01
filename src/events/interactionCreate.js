import { Events, MessageFlags } from "discord.js"

export const name = Events.InteractionCreate

/**
 * @param {import("discord.js").Interaction} interaction
 */
export const listener = async interaction => {
  if (!interaction.isChatInputCommand()) return

  const command = interaction.client.commands.get(interaction.commandName)
  if (!command) return

  try {
    await command.execute(interaction)
  } catch (err) {
    console.error(`❌ Error executing command "${interaction.commandName}":`, err)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: "There was an error.", flags: MessageFlags.Ephemeral })
    } else {
      await interaction.reply({ content: "There was an error.", flags: MessageFlags.Ephemeral })
    }
  }
}
