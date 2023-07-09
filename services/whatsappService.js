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
            Authorization: "Bearer EAAMaY0K534YBAIWEiTp4mU7cW14KBvSJ8ZAcWh9oITvPjLQM6mJ7Mri5JhSmwQB1mwZBsO6DlDujMqDagROMaKimjlTKiFqRKEM6r7tvCJArWqAeT7z2SYAB5cyAEU9uwYWldPidTu9ZCJAkjZBih0Ob1Fo8TI3TvzYcr4tkhrVZBoAhVe7YI"
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