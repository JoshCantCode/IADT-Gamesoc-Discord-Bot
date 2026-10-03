import { config } from "seyfert";
import "dotenv/config"
import { GatewayIntentBits } from "seyfert";

export default config.bot({
  token: process.env.BOT_TOKEN ?? "",
  locations: {
      base: "dist",
      commands: "commands"
  },
  intents: Object.values(GatewayIntentBits),
  publicKey: "...", // replace with your public key
  port: 4444, // replace with your application's port
});
