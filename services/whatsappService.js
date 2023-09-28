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
            Authorization: "Bearer EAAMaY0K534YBO3UlrUMdKBkkysw9Tbva7gzjkYvnqjj1Pebw9OsN8L5ZA4qtbtI8tlgXqoPmxCvL15dGaU8QdUDkaOECCWRE6ZAVoUbgfvn357LLjrqQAf2KsZBzORJYV08JJOWuEQ3J0XApAuylsCu9WSKeeUqNCnZACGAqH9OVxfZAeBXgJC6XPnjJJWzX8AXmznULpsNaXZCK5AWSgZD"
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
            Authorization: "Bearer EAAMaY0K534YBO0hX4xXBhNOZBtKcJy6kfZB6WfHXhskAKMyq0ZBD361Q2gsZAgE8JC6VKSJWBZA7Qei7r4jzZAaaYqcsNtjjm7RrlR7r51zwfzL6AjK3WAao5RDURvgFUgPY2V1Rn5r1aZAXepdzM5TxJwXW8A5FlqU7sr5WPE0BiPdBa6seXszFaPCfXFjoSrYqYVFbBCesSBElZAEwZBwIZD"
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