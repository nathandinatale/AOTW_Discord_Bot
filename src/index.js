import { config } from "dotenv";
import {
  Client,
  Events,
  GatewayIntentBits,
  Partials,
  Routes,
} from "discord.js";
import { REST } from "@discordjs/rest";

import albumCommand, {
  handleAlbumCommand,
  handleAlbumRating,
} from "./commands/album.js";
import pingCommand, { handlePingCommand } from "./commands/ping.js";

config();

const TOKEN = process.env.AOTW_BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction],
});

const rest = new REST({ version: "10" }).setToken(TOKEN);

client.login(TOKEN);

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === "album") {
    handleAlbumCommand(interaction);
  }
  if (interaction.commandName == "ping") {
    handlePingCommand(interaction);
  }
});

// first param name of event, second is callback function handling the event
client.on(Events.ClientReady, () =>
  console.log(`${client.user} Bot has logged in.`)
);

async function main() {
  const commands = [albumCommand, pingCommand];
  try {
    console.log("Started refreshing application (/) commands.");
    // Deletes Global commands
    await rest
      .put(Routes.applicationCommands(CLIENT_ID), {
        body: [],
      })
      .then(() => console.log("Successfully deleted global commands"));
    // Adds global commands
    await rest
      .put(Routes.applicationCommands(CLIENT_ID), {
        body: commands,
      })
      .then(() => console.log("Succesfully added commands"));
  } catch (err) {
    console.log(err);
  }
}

// main();

client.on(Events.MessageCreate, (message) => {
  if (message.partial) {
    console.log("The message is partial.");
  } else {
    console.log("The message is not partial.");
  }
  console.log(message.content);
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
  // When a reaction is received, check if the structure is partial
  if (reaction.partial) {
    // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
    try {
      await reaction.fetch();
    } catch (error) {
      console.error("Something went wrong when fetching the message:", error);
      // Return as `reaction.message.author` may be undefined/null
      return;
    }
  }

  if (user.bot) return;

  if (reaction.message.type !== 20) return;

  const userReactions = await reaction.message.reactions.cache.filter(
    (userReaction) =>
      userReaction.emoji.name !== reaction.emoji.name && userReaction.count > 1
  );

  try {
    for (const userReaction of userReactions.values()) {
      await userReaction.users.remove(user.id);
    }
  } catch (error) {
    console.error("Failed to remove reactions.");
  }

  // Now the message has been cached and is fully available
  console.log(
    `${reaction.message.author}'s message "${reaction.message.content}" gained a reaction by ${user}`
  );

  if (reaction.message.interaction.commandName === "album")
    handleAlbumRating(reaction, user);

  // The reaction is now also fully available and the properties will be reflected accurately:
  console.log(
    `${reaction.count} user(s) have given the same reaction to this message!`
  );
});
