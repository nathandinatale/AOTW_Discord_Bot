import { SlashCommandBuilder } from "@discordjs/builders";
import * as firebaseClient from "../firebase.js";

const rateCommand = new SlashCommandBuilder()
  .setName("rate")
  .setDescription("Give a rating to the AOTW")
  .addStringOption((option) =>
    option
      .setName("album")
      .setDescription("Rate the following album")
      .setRequired(true)
      .setAutocomplete(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("rating")
      .setDescription("Rating for the album")
      .setRequired(true)
  );

rateCommand.autocomplete = async (interaction) => {
  const focusedValue = interaction.options.getFocused();
  const albums = await firebaseClient.getAlbumTitles();
  const choices = await albums.map((album) => album.title);
  const albumMap = new Map();
  albums.map((album) => albumMap.set(album.title, album.id));
  const filtered = choices.filter((choice) => choice.startsWith(focusedValue));
  const responses = filtered.map((choice) => ({
    name: choice,
    value: albumMap.get(choice),
  }));
  console.log(responses);
  await interaction.respond(responses);
};

rateCommand.execute = async (interaction) => {
  console.log(interaction.user.id);
  console.log(interaction.user.username);
  const albumId = interaction.options.getString("album");

  const rating = interaction.options.getInteger("rating");
  if (!(rating > 0 && rating <= 10)) {
    await interaction.reply("Invalid rating, must be integer between 1-10");
    return;
  }

  await firebaseClient.writeRatingData(
    albumId,
    interaction.user.id,
    interaction.user.username,
    rating
  );

  const ratedAlbum = await firebaseClient.getAlbum(albumId);
  interaction.reply(
    `${interaction.user.username} rated *${ratedAlbum.title} - ${ratedAlbum.artist}* a ${rating}`
  );
};

const rateCommandJSON = rateCommand.toJSON();
export default rateCommandJSON;
