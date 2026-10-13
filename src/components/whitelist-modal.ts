import { MessageFlags, ModalCommand, ModalContext } from "seyfert";
import { addWhitelistEntry, studentNumberWhitelisted, usernameWhitelisted } from "../db";
import { STUDENT_NUMBER_PATTERN, USERNAME_PATTERN } from "../whitelist";

export default class WhitelistModalCommand extends ModalCommand {
  filter(context: ModalContext): boolean {
    return context.customId === "whitelist:modal";
  }

  async run(context: ModalContext) {
    const name = context.getInputValue("whitelist:name", true) as string;
    const username = context.getInputValue("whitelist:username", true) as string;
    const studentNumber = context.getInputValue("whitelist:number", true) as string;
    const pvp = (context.getInputValue("whitelist:pvp", true) as string[])[0] === "yes";

    if (!STUDENT_NUMBER_PATTERN.test(studentNumber)) {
      return context.write({
        content: "Your student number is invalid. It should look like `N00YYXXXX`, e.g. `N00231234`.",
        flags: MessageFlags.Ephemeral,
      });
    }

    if (!USERNAME_PATTERN.test(username)) {
      return context.write({
        content: "That Minecraft username doesn't look right. Use 3-16 letters, numbers or underscores.",
        flags: MessageFlags.Ephemeral,
      });
    }

    if (usernameWhitelisted(username)) {
      return context.write({
        content: `The username **${username}** is already whitelisted.`,
        flags: MessageFlags.Ephemeral,
      });
    }

    if (studentNumberWhitelisted(studentNumber)) {
      return context.write({
        content: "That student number is already whitelisted.",
        flags: MessageFlags.Ephemeral,
      });
    }

    addWhitelistEntry({ userId: context.author.id, name, username, studentNumber, pvp });

    return context.write({
      content: `You're on the list, **${name}**! \`${username}\` will be whitelisted shortly.`,
      flags: MessageFlags.Ephemeral,
    });
  }
}
