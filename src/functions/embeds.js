import { EmbedBuilder } from "discord.js"
import { formatBytes } from "./helper.js"

/**
 * This file contains pretty much all embeds that the bot will use, in no particular order.
 * Idk how to make them look cleaner.
 */

/**
 * Seafile libraries listing embed.
 *
 * @param {Array<Object>} libraries Array of library objects from Seafile's API
 * @returns {EmbedBuilder}
 */
export const seafileLibrariesList = libraries => {
  const displayLimit = Math.min(libraries.length, 3)

  const embed = new EmbedBuilder()
    .setTitle("📂  Seafile Libraries")
    .setColor("#1ABC9C")
    .setTimestamp()
    .setFooter({
      text: `Displayed ${displayLimit}/${libraries.length} ${libraries.length === 1 ? "library" : "libraries"} fetched`
    })

  for (const lib of libraries.slice(0, displayLimit)) {
    const details = [
      `**ID:** \`${lib.id}\``,
      `**Owner:** ${lib.owner_name}`,
      `**Size:** ${lib.size_formatted}`,
      `**Last Modified:** <t:${lib.mtime}:R> by ${lib.modifier_name}`,
      `**Permission:** \`${lib.permission}\``
    ].join("\n")

    embed.addFields({ name: lib.name, value: details })
  }

  return embed
}

/**
 * Seafile single library detail embed.
 *
 * @param {Object} lib Library object from Seafile's API
 * @returns {EmbedBuilder}
 */
export const seafileLibraryDetails = lib => {
  const embed = new EmbedBuilder().setTitle("📁  Seafile Library Details").setColor("#1ABC9C").setTimestamp()

  const details = [
    `**ID:** \`${lib.id}\``,
    `**Owner:** ${lib.owner}`,
    `**Size:** ${formatBytes(lib.size)}`,
    `**Encrypted:** ${lib.encrypted ? "Yes" : "No"}`,
    `**Permission:** \`${lib.permission}\``,
    `**Last Modified:** <t:${lib.mtime}:R> by ${lib.modifier_name}`,
    `**File Count:** ${lib.file_count}`,
    `**Root ID:** \`${lib.root}\``,
    `**Head Commit ID:** \`${lib.head_commit_id}\``
  ].join("\n")

  embed.addFields({ name: lib.name, value: details })

  return embed
}

/**
 * Seafile library creation embed.
 *
 * @param {Object} lib Library object from Seafile's API upon creation
 * @returns {EmbedBuilder}
 */
export const seafileLibraryCreate = lib => {
  const embed = new EmbedBuilder().setTitle("📂  Seafile Library Created").setColor("#1ABC9C").setTimestamp()

  const details = [
    `**ID:** \`${lib.repo_id}\``,
    `**Created:** <t:${lib.mtime}:R>`,
    `**Permission:** \`${lib.permission}\``,
    `**Version:** \`${lib.repo_version}\``,
    `**Head Commit ID:** \`${lib.head_commit_id}\``
  ].join("\n")

  embed.addFields({ name: lib.repo_name, value: details })

  return embed
}

/**
 * Seafile library deletion embed.
 *
 * @param {Object} lib Library object from Seafile's API upon deletion
 * @returns {EmbedBuilder}
 */
export const seafileLibraryDelete = lib => {
  const embed = new EmbedBuilder().setTitle("🗑️  Seafile Library Deleted").setColor("#E74C3C").setTimestamp()

  const details = [
    `**ID:** \`${lib.id}\``,
    `**Owner:** ${lib.owner}`,
    `**Size:** ${formatBytes(lib.size)}`,
    `**Last Modified:** <t:${lib.mtime}:R> by ${lib.modifier_name}`,
    `**Permission:** \`${lib.permission}\``,
    `**File Count:** ${lib.file_count}`,
    `**Head Commit ID:** \`${lib.head_commit_id}\``
  ].join("\n")

  embed.addFields({ name: lib.name, value: details })

  return embed
}
