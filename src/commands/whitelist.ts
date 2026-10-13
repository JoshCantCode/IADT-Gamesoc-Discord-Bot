import { Command, CommandContext, Declare } from "seyfert";
import { openWhitelistModal } from "../whitelist";

@Declare({
  name: "whitelist",
  aliases: ["wl"],
  description: "Get whitelisted on the MC server!",
  guildId: ["1213491918558732358"],
})
export default class WhitelistCommand extends Command {
  async run(context: CommandContext) {
    return await openWhitelistModal(context);
  }
}
