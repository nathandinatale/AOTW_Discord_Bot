import { SlashCommandBuilder } from "discord.js";
import * as firebaseClient from "../firebase.js";

const pingCommand = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export const handlePingCommand = async (interaction) => {
  // firebaseClient.integerizeRatings();
  interaction.reply("Pong!");
};

const pingCommandJSON = pingCommand.toJSON();

export default pingCommandJSON;
