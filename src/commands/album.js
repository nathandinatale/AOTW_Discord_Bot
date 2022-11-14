import { SlashCommandBuilder } from "@discordjs/builders";
import * as firebaseClient from "../firebase.js";

const albumCommand = new SlashCommandBuilder()
  .setName("album")
  .setDescription("Set a new AOTW")
  .addStringOption((option) =>
    option
      .setName("title")
      .setDescription("Enter the title of the album")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("artist")
      .setDescription("Enter the album's primary artist")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("description")
      .setDescription("Enter a brief description")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("link")
      .setDescription("Enter a link to the album")
      .setRequired(true)
  );

const albumCommandJSON = albumCommand.toJSON();

export const handleAlbumCommand = async (interaction) => {
  const description = interaction.options.getString("description");
  description
    ? interaction.reply(`${description}`)
    : interaction.reply("Something went wrong");
  const message = await interaction.fetchReply();
  message.react("1️⃣"),
    message.react("2️⃣"),
    message.react("3️⃣"),
    message.react("4️⃣"),
    message.react("5️⃣"),
    message.react("6️⃣"),
    message.react("7️⃣"),
    message.react("8️⃣"),
    message.react("9️⃣"),
    message.react("🔟");

  firebaseClient.writeAlbumData(
    message.id,
    interaction.options.getString("title"),
    interaction.options.getString("artist"),
    interaction.options.getString("description"),
    interaction.options.getString("link"),
    interaction.user.id,
    interaction.user.username
  );
};

export const handleAlbumRating = (reaction, user) => {
  firebaseClient.writeRatingData(
    reaction.message.id,
    user.id,
    user.username,
    reaction.emoji.name
  );

  return;
};

export default albumCommandJSON;
