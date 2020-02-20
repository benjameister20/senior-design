

export default function getShibParams(url) {
	return querystring.parse(window.location.hash.substring(1));
}
