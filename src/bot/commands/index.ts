import { Message, GuildMember, Guild, User } from "discord.js";

import Instance from "./instance.js";

export type CommandContext = {
	user: User;
	guild: Guild | null;
	member: GuildMember | null;
	message: Message;
	args: string[];
};

export type Command = {
	name: string;
	exec: (ctx: CommandContext) => any;
};

// TODO: get the 
export default {
	"instance": Instance
};