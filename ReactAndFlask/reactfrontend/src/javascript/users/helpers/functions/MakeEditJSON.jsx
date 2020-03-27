import React from "react";

export default function makeEditJSON(originalUsername, username, password, display_name, email, privileges) {
	return {
		'username_original':originalUsername,
		'username': username,
		'password': password,
		'display_name': display_name,
		'email': email,
		'privilege': privileges,
	}
}
