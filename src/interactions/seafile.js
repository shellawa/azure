import { MessageFlags, SlashCommandBuilder } from "discord.js"
import ky from "ky"
import * as embeds from "../functions/embeds.js"

// prettier-ignore
export const data = new SlashCommandBuilder()
  .setName("seafile")
  .setDescription("Interacting with the Seafile API")
  .addSubcommandGroup(subcommandGroup =>
    subcommandGroup
      .setName("libraries")
      .setDescription("Library related options.")
      .addSubcommand(subcommand =>
        subcommand
          .setName("list")
          .setDescription("List or search libraries available.")
          .addStringOption(option =>
            option
              .setName("type")
              .setDescription("Type of the libraries.")
              .addChoices(
                {name: "mine", value: "mine"},
                {name: "shared", value: "shared"},
                {name: "group", value: "group"},
                {name: "org", value: "org"}
              )
          )
          .addStringOption(option => 
            option
              .setName("name")
              .setDescription("For searching.")
          )
        )
        .addSubcommand(subcommand => 
          subcommand
            .setName("get")
            .setDescription("Get metadata of a library by ID.")
            .addStringOption(option =>
              option
                .setName("id")
                .setDescription("The library ID.")
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
          subcommand
            .setName("create")
            .setDescription("Create a new library.")
            .addStringOption(option =>
              option
                .setName("name")
                .setDescription("The library name.")
                .setRequired(true)
            )
        )
                .addSubcommand(subcommand =>
          subcommand
            .setName("delete")
            .setDescription("Delete a library.")
            .addStringOption(option =>
              option
                .setName("id")
                .setDescription("The library ID.")
                .setRequired(true)
            )
            .addStringOption(option =>
              option
                .setName("are_you_sure")
                .setDescription("THIS ACTION IRREVERSIBLE!!")
                .addChoices(
                  {name: "No (Abort)", value: "no"},
                  {name: "Yes (Irreversible)", value:"yes"}
                )
                .setRequired(true)
            )
        )
  )

export const isGlobal = true

/**
 * @param {import("discord.js").Interaction} interaction
 */
export const execute = async interaction => {
  const seafileAPI = process.env.SEAFILE_API
  const seafileToken = process.env.SEAFILE_TOKEN
  const subcommandGroup = interaction.options.getSubcommandGroup()
  const subcommand = interaction.options.getSubcommand()

  const API = ky.create({
    prefixUrl: `${seafileAPI}/api2`,
    headers: { Authorization: `Bearer ${seafileToken}` },
    timeout: 20000
  })

  switch (subcommandGroup) {
    case "libraries":
      switch (subcommand) {
        case "list": {
          const type = interaction.options.getString("type") ?? ""
          const nameContains = interaction.options.getString("name") ?? ""
          const res = await API.get("repos/", { searchParams: { type, nameContains } }).json()
          const embed = embeds.seafileLibrariesList(res)

          await interaction.reply({ embeds: [embed] })
          break
        }
        case "get": {
          const id = interaction.options.getString("id")
          const res = await API.get("repos/" + id).json()
          const embed = embeds.seafileLibraryDetails(res)

          await interaction.reply({ embeds: [embed] })
          break
        }
        case "create": {
          const name = interaction.options.getString("name")
          const res = await API.post("repos/", { json: { name } }).json()
          const embed = embeds.seafileLibraryCreate(res)

          await interaction.reply({ embeds: [embed] })
          break
        }
        case "delete": {
          const id = interaction.options.getString("id")
          if (interaction.options.getString("are_you_sure") == "no") {
            await interaction.reply({ content: "Deletion aborted.", flags: MessageFlags.Ephemeral })
            break
          }
          const res = await API.get("repos/" + id).json() // get the details before deleting
          await interaction.deferReply() // deletion could take longer
          await API.delete("repos/" + id).json() // actually deleting the library, only returns "success"
          const embed = embeds.seafileLibraryDelete(res)

          await interaction.editReply({ embeds: [embed] })
          break
        }
      }
  }
}
