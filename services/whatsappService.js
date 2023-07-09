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
            Authorization: "Bearer EAAMaY0K534YBAGghEaOwEW8ab7Mc3YErZCqTiTlmR1vZAGOMkkU6tvULq6308cZAuEZBE2ZBi5CQEfYGRazoqnYsJJiVH6kMNuQsnaNXuDCnCTrOZChEeOIcR2O3wqFrJHuRFZAaLwhJoaFlEudyJltZB4BAYKudIhkHxVLTEwG9QOuk4N7awj3AZCyARTLaQZAFyLpfWvM2ZAGygZDZD"
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