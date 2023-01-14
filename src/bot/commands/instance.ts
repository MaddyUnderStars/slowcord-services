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

import { Command } from "./index.js";
import fetch from "node-fetch";

const cache: { [key: string]: number; } = {
	users: 0,
	guilds: 0,
	messages: 0,
	lastChecked: 0,
};

export default {
	name: "instance",
	exec: async ({ message }) => {
		if (
			Date.now() >
			cache.lastChecked + parseInt(process.env.CACHE_TTL as string)
		) {
			const resp = await fetch(`${process.env.ENDPOINT_API}/policies/instance/stats`, {
				headers: {
					authorization: process.env.TOKEN as string,
				}
			});
			const json: any = await resp.json();
			const { all_time } = json;

			cache.users = all_time.users;
			cache.guilds = all_time.guilds;
			cache.messages = all_time.messages;
			cache.lastChecked = Date.now();
		}

		return message.reply({
			embeds: [
				{
					title: "Instance Stats",
					description:
						"For more indepth information, check out https://grafana.understars.dev",
					footer: {
						text: `Last checked: ${Math.floor(
							(Date.now() - cache.lastChecked) / (1000 * 60),
						)} minutes ago`,
					},
					fields: [
						{
							inline: true,
							name: "Total Users",
							value: cache.users.toString(),
						},
						{
							inline: true,
							name: "Total Guilds",
							value: cache.guilds.toString(),
						},
						{
							inline: true,
							name: "Total Messages",
							value: cache.messages.toString(),
						},
					],
				},
			],
		});
	},
} as Command;
