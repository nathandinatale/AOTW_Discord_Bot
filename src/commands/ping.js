import { SlashCommandBuilder } from "discord.js";

const pingCommand = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export const handlePingCommand = async (interaction) => {
  interaction.reply("Pong!");
};

const pingCommandJSON = pingCommand.toJSON();

export default pingCommandJSON;
