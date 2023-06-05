const fs = require("fs");
const https = require("https");
function SendMessageWhatsApp(data){
    const options = {
        host: "graph.facebook.com",
        path: "/v15.0/108092808842052/messages",
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer EAAMaY0K534YBAKMcVhaIxGZAvFZAGljDrF7JJ86A8iZAcwqGWTRW6TWOhlFbWxQmpr2TCcF7cQ079KFePrZBArW4RuZBUBVqzikfEGrj8XeQTV57BsFG1Ioh0WCDBucFemdQzHZCMv3pMEUaxDFqcPjv25x9ECXYFe0t10QHGLRARw1ZCOAuCEDnlQvC9xlgwgkwS8fLx8AXAZDZD"
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