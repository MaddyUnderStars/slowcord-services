// basically just serves the atlassin status page scheduled maintenance api response
// also its completely disgusting
// this is not code one should write

import "dotenv/config";
import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import basicAuth from "express-basic-auth";
import { UpcomingResponse, Maintenances } from "./types";
import bodyParser from "body-parser";

const SRC_PATH = path.join(process.cwd(), "src", "statuspage");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/api/v2/scheduled-maintenances/upcoming.json", async (req, res) => {
	const file = await fs.promises.readFile(path.join(SRC_PATH, "incidents.json"));
	var json = JSON.parse(file.toString());
	const scheduled = json.filter((x: Maintenances) => new Date(x.scheduled_for) > new Date());
	const ret: UpcomingResponse = {
		page: {
			id: "1",
			name: "Slowcord Status",
			url: "status.understars.dev",
			time_zone: "Australia/Sydney",
			updated_at: null
		},
		scheduled_maintenances: scheduled
	};

	return res.json(ret);
});

// this isn't actually in the API but I don't really care.
app.get("/api/v2/all.json", async (req, res) => {
	const file = await fs.promises.readFile(path.join(SRC_PATH, "incidents.json"));
	return res.json(JSON.parse(file.toString()).reverse());
});

app.get("/api/v2/:id.json", async (req, res) => {
	const file = await fs.promises.readFile(path.join(SRC_PATH, "incidents.json"));
	var json = JSON.parse(file.toString());
	var incident = json.find((x: any) => x.id == req.params.id);
	if (!incident) return res.status(404);
	return res.json(incident);
});

app.get("/incidents/:id", (req, res) => {
	res.sendFile(path.join(SRC_PATH, "public", "incident.html"));
});
app.use(express.static(path.join(SRC_PATH, "public"), { extensions: ["html"] }));

app.use(basicAuth({
	users: { "admin": process.env.STATUS_PAGE_PASS as string },
	challenge: true,
}));

// also don't care
app.post("/api/v2/new", async (req, res) => {
	const file = path.join(SRC_PATH, "incidents.json");
	const text = (await fs.promises.readFile(file)).toString();
	const json = JSON.parse(text);
	json.push({ id: json.length, ...req.body });
	await fs.promises.writeFile(file, JSON.stringify(json));
	return res.redirect(`/incidents/${json.length - 1}`)
});

app.use("/secure", express.static(path.join(SRC_PATH, "secure"), { extensions: ["html"] }));

app.listen(process.env.STATUS_PAGE_PORT, () => {
	console.log(`Listening on port ${process.env.STATUS_PAGE_PORT}`);
});