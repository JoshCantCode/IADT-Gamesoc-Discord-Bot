import { Command, CommandContext, Declare, MessageFlags } from "seyfert";
import { getWhitelistedUsernames } from "../db";
import { buildWhitelistCommands } from "../whitelist";

@Declare({
  name: "whitelistsync",
  aliases: ["wlsync"],
  description: "List the Minecraft whitelist commands for everyone",
  guildId: ["1213491918558732358"],
})
export default class WhitelistSyncCommand extends Command {
  async run(context: CommandContext) {
    if (!context.member?.permissions.has("ManageGuild")) {
      return context.write({ content: "You need the **Manage Server** permission to use this.", flags: MessageFlags.Ephemeral });
    }

    const usernames = getWhitelistedUsernames();
    if (usernames.length === 0) {
      return context.write({ content: "Nobody has been whitelisted yet.", flags: MessageFlags.Ephemeral });
    }

    const commands = buildWhitelistCommands(usernames);
    const [first, ...rest] = commands;
    await context.write({ content: first, flags: MessageFlags.Ephemeral });
    for (const command of rest) {
      await context.followup({ content: command, flags: MessageFlags.Ephemeral });
    }
  }
}
