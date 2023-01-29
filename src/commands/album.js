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
      .setName("blurb")
      .setDescription("Write a blurb for the album expressing your thoughts")
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
  try {
    const title = interaction.options.getString("title");
    const artist = interaction.options.getString("artist");
    const link = interaction.options.getString("link");
    const blurb = interaction.options.getString("blurb");
    await pingRole(interaction.channel);
    interaction.reply({
      content: `*${title}* - ${artist}\n\n${blurb} \n\n${link}`,
    });
  } catch (err) {
    interaction.reply("Something went wrong");
  }

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

// have to ping seperately because interaction reply pings don't go through
const pingRole = async (channel) => {
  await channel.send("<@&757257690350092530>");
};

export const handleAlbumRating = (reaction, user) => {
  const converterMap = new Map();
  converterMap.set("1️⃣", 1);
  converterMap.set("2️⃣", 2);
  converterMap.set("3️⃣", 3);
  converterMap.set("4️⃣", 4);
  converterMap.set("5️⃣", 5);
  converterMap.set("6️⃣", 6);
  converterMap.set("7️⃣", 7);
  converterMap.set("8️⃣", 8);
  converterMap.set("9️⃣", 9);
  converterMap.set("🔟", 10);

  const rating = converterMap.get(reaction.emoji.name);
  if (!rating) return;

  firebaseClient.writeRatingData(
    reaction.message.id,
    user.id,
    user.username,
    rating
  );

  return;
};

export default albumCommandJSON;
