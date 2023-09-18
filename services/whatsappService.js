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
            Authorization: "Bearer EAAMaY0K534YBO71MShJxM6LZC1UyLNEZCwo8bo21RMpQg0pVmqJqiuIIVt4ZCMbs8X0MKuQJhUueo8FJMTTgvBL6ocES201bWZAvz4yXwCCcpKKxdnFdP2STvwEZBPwQMhd02rHaBVNtkhSMZC8iAOZBx43DtACN2z23Y3CxWsFPRGEvMdmkoo7d1niE4L1llEAAMaY0K534YBOxDBMnLCl3YMfpkOGR8uez7kCC0JDRZB2CAa4fYRzjgwTc4TGZAR0NTn2trADiprrpv51KuE0PIR8UIHlUOuZBreabLxDcBPoWFWrZCwOctqH9jAZApGYkB7wXuOnwCVeovTnWlpoccBcZBnawXQ63IBDoxPZA4TPJQq5aJFaFvTG4gxLExQcQpP3gkyVgiZBbtynpboUzQZDqP4F5LZCbdErZCD2pnDficEZD"
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
            EAAMaY0K534YBOxDBMnLCl3YMfpkOGR8uez7kCC0JDRZB2CAa4fYRzjgwTc4TGZAR0NTn2trADiprrpv51KuE0PIR8UIHlUOuZBreabLxDcBPoWFWrZCwOctqH9jAZApGYkB7wXuOnwCVeovTnWlpoccBcZBnawXQ63IBDoxPZA4TPJQq5aJFaFvTG4gxLExQcQpP3gkyVgiZBbtynpboUzQZD        }
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