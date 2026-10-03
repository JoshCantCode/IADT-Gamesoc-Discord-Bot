import { file } from "@slipher/player";
import { Command, CommandContext, createStringOption, Declare, Options, UsingClient } from "seyfert";
import { getTTSFile } from "../workers/tts-worker";

const options = {
  content: createStringOption({
    description: "The content you want to say! Refrain from using emojis or any sort of links"
  })
}

type Connection = Awaited<ReturnType<UsingClient["voice"]["connect"]>>;
const connections = new Map<string, { channelId: string; connection: Connection }>();


@Options(options)
@Declare({
  name: "tts",
  aliases: ["say"],
  description: "Joins a call and says the message out loud (Useful when you can't use your mic!)",
  guildId: ["1213491918558732358"],
})
export default class TTSCommand extends Command {
  async run(context: CommandContext<typeof options>) {
    const { client, member, guildId } = context;
    const message = context.options.content;

    if (!member || !guildId) {
      return context.write({ content: "Apparently you don't exist? Text Josh" });
    }

    const voice = await member.voice().catch(() => null);
    if (!voice?.channelId) {
      return context.write({ content: "You are not in a voice channel!" });
    }

    await context.deferReply();
    let entry = connections.get(guildId);
    if (!entry || entry.channelId !== voice.channelId) {
      let connection;
      try {
        connection = await client.voice.connect({
          guildId,
          channelId: voice.channelId,
          move: true,
        });
      } catch (error) {
        await client.voice.disconnect(guildId).catch(() => {});
        return context.editOrReply({
          content: "Couldn't join the voice channel, try again in a moment.",
        });
      }
      entry = { channelId: voice.channelId, connection };
      connections.set(guildId, entry);
    }

    const guildPlayer = client.player.create(entry.connection);
    const content = `${member.name} said ${message}`
    await getTTSFile(content);
    await guildPlayer.enqueue(file("./temp/tts.mp3"));

    await context.editOrReply({ content: `Said ${message}!` });
  }
}
