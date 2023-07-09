const fs = require("fs");
const https = require("https");
function SendMessageWhatsApp(data){
    const options = {
        host: "graph.facebook.com",
        path: "/v17.0/108092808842052/messages",
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer EAAMaY0K534YBAL54OapaK4NJfynfv2NZC7kaJrHZCuOBU6kUPCr2opkZBgCpnvkPP5YM8xmh1VsrumVy8mgDgkwFffMalVibED5UMVurjUk7SZAwocZBvRYpIZCYLrgm2JeDeUhNMoPUPGamHD7j41o7XZAi2C0nEjyR2uyWmFhVgGN04aFCHQbKLWKPe0TrIyM7rBpjXJhKwZDZD"
        }
    };
    const req = https.request(options, res => {
        res.on("data", d=> {
            process.stdout.write(d);
        });
    });

    req.on("error", error => {
        console.error(error);
    });

    req.write(data);
    req.end();
}
module.exports = {
    SendMessageWhatsApp
};