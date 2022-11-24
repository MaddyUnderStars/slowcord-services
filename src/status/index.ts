/*
	alright.
	so the previous versions of this kinda sucked,
	because the node event loop would cause a whole ton of stuff that just broke timing.
	so here's a new attempt and not breaking timing
	( basically, just spawn different processes to do it :p )
*/

import "dotenv/config";
import child_process from "child_process";
import util from "util";
const exec = util.promisify(child_process.exec);

import Fosscord from "fosscord-gopnik";

import mysql from "mysql2/promise";

import fetch from "node-fetch";

const doUrlMeasurement = async (url: URL) => {
	try {
		const { stdout } = await exec(
			`curl "${url.toString()}" -H "Authorization: ${process.env.TOKEN}" -s --fail --show-error -I -X GET -o NUL -w "%{time_pretransfer}\\n%{time_total}"`
		);
		const split = stdout.split("\n");
		const pretransfer = parseFloat(split[1]);
		const total = parseFloat(split[0]);
		return Math.floor((pretransfer - total) * 1000);
	}
	catch (e: any) {
		// console.error(e.stderr.split(": ")[2].trim());
		return -1;
	}
};

const measureMessageCreate = () => new Promise((resolve, reject) => {
	const client = new Fosscord.Client({ intents: [], http: { api: "https://slowcord.understars.dev/api" } });
	let start: any;
	let message;
	client.on("messageCreate", async (message) => {
		if (!start) return;
		if (message.author.id != client.user!.id) return;
		if (message.channel.id != "1019955729054267764") return;
		if (message.content != "hello this is a special message kthxbye") return;

		const ret = Math.floor(performance.now() - start);
		client.destroy();
		await fetch(
			`https://slowcord.understars.dev/api/v9/channels/1019955729054267764/messages/${message.id}`,
			{
				method: "DELETE",
				headers: {
					authorization: process.env.TOKEN!,
				},
			},
		);
		resolve(ret);
	});

	client.on("ready", async () => {
		const channel = await client.channels.fetch("1019955729054267764");
		if (!channel?.isText()) return;	// just for types
		start = performance.now();
		message = await channel.send("hello this is a special message kthxbye");
	});

	client.login(process.env.TOKEN);
});

const doGetMonitor = async () => {
	const res = await fetch("https://slowcord.understars.dev/api/v9/-/monitorz", {
		headers: {
			authorization: process.env.TOKEN!
		}
	});
	const json = await res.json();
	return json;
};

const doSaveMeasurements = async (data: any, monitor: any) => {
	const conn = await mysql.createConnection(process.env.DATABASE!);
	for (const [key, value] of Object.entries(data)) {
		try {
			await conn.execute(
				"INSERT INTO performance (value, endpoint, timestamp) VALUES (?, ?, ?)",
				[value, key, new Date()]
			);
		}
		catch (e) {
			console.error(e);
		}
	}

	await conn.execute(
		"INSERT INTO monitor (time, cpu, procUp, sysUp, ram, sessions) VALUES (?, ?, ?, ?, ?, ?)",
		[new Date(), monitor.load[1], monitor.procUptime, monitor.sysUptime, monitor.memPercent, monitor.sessions]
	);

	await conn.end();
};

const measurements = async () => {
	const data: any = {};

	data["ping"] = await doUrlMeasurement(new URL("https://slowcord.understars.dev/api/v9/ping"));
	data["users/@me"] = await doUrlMeasurement(new URL("https://slowcord.understars.dev/api/v9/users/@me"));
	data["channel"] = await doUrlMeasurement(new URL("https://slowcord.understars.dev/api/v9/channels/992711441737941119"));
	data["messages"] = await doUrlMeasurement(new URL("https://slowcord.understars.dev/api/v9/channels/992711441737941119/messages?limit=1"));
	data["login"] = await doUrlMeasurement(new URL("https://slowcord.understars.dev/login"));

	data["messageCreate"] = await measureMessageCreate();

	const monitor = await doGetMonitor();

	await doSaveMeasurements(data, monitor);

	setTimeout(measurements, parseInt(process.env.MEASURE_INTERVAL!));
};

measurements();