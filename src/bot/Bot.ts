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

import { Message } from "discord.js";
import { Client } from "fosscord-gopnik/build/lib"; // huh? oh well. some bugs in my lib Ig

import { Command, default as Commands } from "./commands/index.js";

export default class Bot {
	client: Client;
	commands: { [key: string]: Command } = {};

	constructor(client: Client) {
		this.client = client;
	}

	onReady = async () => {
		this.commands = Commands;

		console.log(`Logged in as ${this.client.user!.tag}`);

		this.client.user!.setPresence({
			activities: [
				{
					name: "EVERYTHING",
					type: "WATCHING",
				},
			],
		});
	};

	onMessageCreate = async (msg: Message) => {
		const prefix = process.env.BOT_PREFIX as string;
		if (msg.author.bot) return;
		if (!msg.content || msg.content.indexOf(prefix) === -1) return;

		const content = msg.content.slice(prefix.length).split(" ");
		const cmd = content.shift();
		if (!cmd) return;
		const args = content;

		const command = this.commands[cmd];
		if (!command) return;

		await command.exec({
			user: msg.author,
			member: msg.member,
			guild: msg.guild,
			message: msg,
			args: args,
		});
	};
}
