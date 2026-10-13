import { CommandContext, Label, Modal, StringSelectMenu, StringSelectOption, TextInput, TextInputStyle } from "seyfert";

export const STUDENT_NUMBER_PATTERN = /^N00(23|24|25|26)\d{4}$/;
export const USERNAME_PATTERN = /^[A-Za-z0-9_]{3,16}$/;

const COMMAND_PREFIX = "/whitelist ";
const MAX_COMMAND_LENGTH = 200;

export async function openWhitelistModal(context: CommandContext): Promise<undefined> {
  const nameInput = new Label().setLabel("Whats your name?").setComponent(new TextInput().setCustomId("whitelist:name").setRequired(true).setStyle(TextInputStyle.Short));
  const usernameInput = new Label().setLabel("Whats your MC username?").setComponent(new TextInput().setCustomId("whitelist:username").setLength({ max: 16, min: 3 }).setRequired(true).setStyle(TextInputStyle.Short));
  const studentNumberInput = new Label().setLabel("Whats your student number?").setComponent(new TextInput().setCustomId("whitelist:number").setLength({ max: 9, min: 9 }).setRequired(true).setStyle(TextInputStyle.Short));
  const pvpSelect = new Label().setLabel("Do you want to PvP?").setComponent(new StringSelectMenu().setCustomId("whitelist:pvp").setOptions(new StringSelectOption({ label: "Yes", value: "yes" }), new StringSelectOption({ label: "No", value: "no" })));

  const modal = new Modal().setTitle("Lets get you whitelisted!")
    .setCustomId("whitelist:modal")
    .addComponents(nameInput, usernameInput, studentNumberInput, pvpSelect);

  return await context.modal(modal);
}

export function buildWhitelistCommands(usernames: string[]): string[] {
  const commands: string[] = [];
  let current = "";

  for (const username of usernames) {
    const next = current ? `${current} ${username}` : `${COMMAND_PREFIX}${username}`;
    if (current && next.length > MAX_COMMAND_LENGTH) {
      commands.push(current);
      current = `${COMMAND_PREFIX}${username}`;
    } else {
      current = next;
    }
  }

  if (current) commands.push(current);
  return commands;
}
