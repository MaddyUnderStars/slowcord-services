// TODO: move this code to fosscord-server?

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
