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

const handleSubmit = async (path, body) => {
	const failureMessage = document.getElementById("failure");

	var response = await fetch(path, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

	const json = await response.json();
	if (json.token) {
		window.localStorage.setItem("token", `"${json.token}"`);
		window.location.href = "/app";
		return;
	}

	if (json.ticket) {
		// my terrible solution to 2fa
		const twoFactorForm = document.forms["2fa"];
		const loginForm = document.forms["login"];

		twoFactorForm.style.display = "flex";
		loginForm.style.display = "none";

		twoFactorForm.ticket.value = json.ticket;
		return;
	}

	// Very fun error message here lol
	const error = json.errors
		? Object.values(json.errors)[0]._errors[0].message
		: json.captcha_key
		? "Captcha required"
		: json.message;

	failureMessage.innerHTML = error;
	failureMessage.style.display = "block";
};
