export async function custom_ajax({
    route, // should start with forward slash. for ex : /common
    method = "GET",
    body = {}
}) {
        var fetch_conf = {
            headers: {
                "Content-Type" : 'application/json'
            },
            method,
        }
        if (method.toLowerCase() === "post") {
            fetch_conf["body"] = JSON.stringify(body)
        }
        var response = await fetch(`http://localhost:4000${route}`, fetch_conf)
    
        if (!response.ok) {
            throw response.text()
        } else {
            try {
                return response.json()
            } catch (e) {
                throw e
            }
        }
}