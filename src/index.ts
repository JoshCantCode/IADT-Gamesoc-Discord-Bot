import { player } from "@slipher/player";
import { voice } from "@slipher/voice";
import { Client, definePlugins, ParseClient } from "seyfert";


// todo: add ffmpeg path via docker

const plugins = definePlugins(
    voice(),
    player({
        ffmpegPath: 'ffmpeg',
        historyLimit: 100,
    }),
);


const client = new Client({plugins});


client.start().then(() => client.uploadCommands({cachePath: "./commands.json"}));


declare module 'seyfert' {
  interface SeyfertRegistry {
    plugins: typeof plugins;
        client: ParseClient<Client<true>>;
    }
}
