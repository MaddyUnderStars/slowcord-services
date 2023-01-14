/*
	Slowcord Services. Additional services for the Slowcord Fosscord instance.
	Copyright (C) 2023 MaddyUnderStars

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published
	by the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

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

// TODO: get commands less poorly
export default {
	"instance": Instance
};