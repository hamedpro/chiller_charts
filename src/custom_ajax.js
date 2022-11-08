export async function custom_ajax({
	route, // should start with forward slash. for ex : /common
	method = "GET",
	body = {},
	base_path = API_BASE_PATH,
}) {
	var fetch_conf = {
		headers: {
			"Content-Type": "application/json",
		},
		method,
	};
	if (method.toLowerCase() === "post") {
		fetch_conf["body"] = JSON.stringify(body);
	}
	var response = await fetch(`${base_path}${route}`, fetch_conf);
	if (window.debug_mode === true) {
		console.info("fetch request submited! path : " + `${base_path}${route}`);
	}
	if (!response.ok) {
		throw response.text();
	} else {
		try {
			return response.json();
		} catch (e) {
			throw e;
		}
	}
}
