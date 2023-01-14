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
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import path from "path";
import fetch from "node-fetch";

const PUBLIC_PATH = path.join(process.cwd(), "src", "login", "public");

const app = express();
app.use(cookieParser());
const port = process.env.LOGIN_PORT;

app.get("/oauth/:type", async (req, res) => {
	const resp = await fetch(`${process.env.ENDPOINT_API}/oauth2/callback/${req.params.type}?code=${req.query.code}`);
	const json = await resp.json() as any;
	const token = json.token;

	res.cookie("token", token);

	res.sendFile(path.join(PUBLIC_PATH, "login.html"));
});

app.use(express.static(PUBLIC_PATH, { extensions: ["html"] }));

(async () => {
	app.listen(port, () => {
		console.log(`Listening on port ${port}`);
	});
})();
