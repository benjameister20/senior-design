import React from "react";

export default function makeCreateJSON(username, password, display_name, email, privileges) {
	return {
		'username': username,
		'password': password,
		'display_name': display_name,
		'email': email,
		'privileges': privileges,
	}
}
