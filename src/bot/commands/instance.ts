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
