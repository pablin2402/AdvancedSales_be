const fs = require("fs");
const https = require("https");
function SendMessageWhatsApp1(data){
    const options = {
        host: "graph.facebook.com",
        path: "/v17.0/108092808842052/messages",
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer EAAMaY0K534YBO9j8rIlA9TgFNlqhbo5cZBzOS8us1ljp6VbOnGOr7k5Nh5gOfymWueNyF1cI6ht7buZCuSZBlgVuis0ZATIp2XIf9ZAJ7JpZB44hOZAwVXdID0njyHMrGk2BLyP0BfuMImy8VA5dDbbW3vPA9Nrjp32JYhZAfCAuHViN98vZAZBioJW0H0RNUq2R7p7wE0UsEZC7G86yrghpUkQ"
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
function SendMessageWhatsApp(number, textResponse){
  const data = JSON.stringify({
    "messaging_product": "whatsapp",
    "to": number,
    "text": {
      "body": textResponse
    },
    "type":"text"
  })
  
    const options = {
        host: "graph.facebook.com",
        path: "/v17.0/108092808842052/messages",
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer EAAMaY0K534YBOwtZCZCuYg2030VzSAYV1ZBFJkXjNxhJ5LWbZAE7tM0JkHLnfUTHZC3cFeoJ2dHR6tSGHpnAdQNwhy4xBCGczc0vCYJxfJwziV9SNzl1wvHtUvroWKLF6axAgxYuZAz27nZB0XOniyNc3R7re20M3TpFgwmOYMqTUXiODntNgeoZB6z4Wo166zQaMs2wtPapYp2SWa8YxpYZD"
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
function getTemplatedMessageInput(recipient, movie, seats) {
    const data = JSON.stringify({
      "messaging_product": "whatsapp",
      "to": recipient,
      "type": "template",
      "template": {
        "name": "sample_movie_ticket_confirmation",
        "language": {
          "code": "en_US"
        },
        "components": [
          {
            "type": "header",
            "parameters": [
              {
                "type": "image",
                "image": {
                  "link": movie.productImage
                }
              }
            ]
          },
          {
            "type": "body",
            "parameters": [
              {
                "type": "text",
                "text": movie.productName
              },
              {
                "type": "text",
                "text": movie.productName
              },
              {
                "type": "text",
                "text": price.priceId.price
              },
              {
                "type": "text",
                "text": seats
              }
            ]
          }
        ]
      }
    }
    );
    return data;

  }
module.exports = {
    SendMessageWhatsApp, SendMessageWhatsApp1, getTemplatedMessageInput
};