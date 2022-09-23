export function custom_ajax({
    route, // should start with forward slash. for ex : /common
    method = "GET",
    body = {}
}) {
    return new Promise((resolve, reject) => {
        var fetch_conf = {
            headers: {
                "Content-Type" : 'application/json'
            },
            method,
        }
        if (method.toLowerCase() === "post") {
            fetch_conf["body"] = JSON.stringify(body)
        }
        fetch(`http://localhost:4000${route}`, fetch_conf).then(response => {
            if (!response.ok) {
                reject(response.text())
            } else {
                try {
                    resolve(response.json())
                } catch (e) {
                    reject(e)
                }
            }
        },error=>reject(error))
    })
}