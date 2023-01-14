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

import "dotenv/config";
import Fosscord from "fosscord-gopnik";
import Bot from "./Bot.js"; // huh?

const client = new Fosscord.Client({
	intents: ["GUILD_MESSAGES"],

	http: {
		api: process.env.ENDPOINT_API,
		cdn: process.env.ENDPOINT_CDN,
		invite: process.env.ENDPOINT_INV,
	},
});

const bot = new Bot(client);

client.on("ready", bot.onReady);
client.on("messageCreate", bot.onMessageCreate);

(async () => {
	await client.login(process.env.TOKEN);
})();
