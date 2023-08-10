const fs = require("fs");
const myConsole = new console.Console(fs.createWriteStream("./sasd.txt"));
const whatsappService = require("../services/whatsappService");
const samples = require("../shared/sampleModels");
const processMessage = require("../shared/processMessage");
const whatsappModel = require("../shared/whatsappmodels");
const Message = require("../models/Message");

const VerifyToken = (req, res) => {
  try {
    var accessToken = "RTQWWTVHBDEJHJKIKIKNDS9090DS";
    var token = req.query["hub.verify_token"];
    var challenge = req.query["hub.challenge"];

    if (challenge != null && token != null && token == accessToken) {
      res.send(challenge);
    } else {
      res.status(400).send();
    }
  } catch (e) {
    res.status(400).send();
  }
};

const ReceivedMessage = (req, res) => {
  try {
    var entry = req.body["entry"][0];
    var changes = entry["changes"][0];
    var value = changes["value"];
    var messageObject = value["messages"];
    if (typeof messageObject != "undefined") 
    {
      var messages = messageObject[0];
      var number = messages["from"];
      var text = GetTextUser(messages);
      myConsole.log(text)
      //whatsappService.SendMessageWhatsApp(number, "El usuario dijo:" + text);
      if (text != "") 
      {
        processMessage.Process(text, number);
      }
      res.send("Recibo mensaje :V");
    }
  } catch (e) { 
    res.send("EVENT_RECEIVED");
  }
};
const getList = async (req, res) => {
  const Messages = await Message.find();
  res.json(Messages);
};
const SendMessageTemplate = (req, res) => {
  var data = whatsappService.getTemplatedMessageInput(59169501045, req.body.listOfProducts, req.body.listOfProducts.qty);
  whatsappService.SendMessageWhatsApp1(data);
};
const SendMessage = (req, res) => {
  if(req.body.message_type === "message"){
    console.log(    req.body.fullMessage,
      req.body.recipientNumber)
    var model = whatsappModel.MessageText(
      req.body.fullMessage,
      req.body.recipientNumber
    );
    whatsappService.SendMessageWhatsApp1(model);
    saveMessage(req);
  }else if (req.body.message_type === "document"){
    var model = whatsappModel.SampleDocument(
      req.body.recipientNumber,
      req.body.link
    );
    var model2 = whatsappModel.MessageText(
      req.body.fullMessage,
      req.body.recipientNumber
    );
    whatsappService.SendMessageWhatsApp1(model);
    whatsappService.SendMessageWhatsApp1(model2);

    saveMessage(req);
  }else if (req.body.message_type === "image"){
    var model = whatsappModel.SampleImage(
      req.body.recipientNumber,
      req.body.link
    );
    var model2 = whatsappModel.MessageText(
      req.body.fullMessage,
      req.body.recipientNumber
    );
    whatsappService.SendMessageWhatsApp1(model);
    whatsappService.SendMessageWhatsApp1(model2);
    saveMessage(req);
  }
}
function saveMessage(req, res) {
  try {
    const message = new Message({
      fullMessage: req.body.fullMessage,
      recipientNumber: req.body.recipientNumber,
      type: req.body.type,
      number: req.body.number,
      id_client: req.body.id_client,
      id_message: req.body.id_message,
      message_type: req.body.message_type,
      from: req.body.from,
      link : req.body.link
    });
    message.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
    });
  } catch (e) {
    myConsole.log(e);
  }
}

function GetTextUser(messages) {
  var text = "";
  var typeMessge = messages["type"];
  if (typeMessge == "text") {
    text = messages["text"]["body"];
  } else if (typeMessge == "interactive") {
    var interactiveObject = messages["interactive"];
    var typeInteractive = interactiveObject["type"];

    if (typeInteractive == "button_reply") {
      text = interactiveObject["button_reply"]["title"];
    } else if (typeInteractive == "list_reply") {
      text = interactiveObject["list_reply"]["title"];
    } else {
      myConsole.log("sin mensaje");
    }
  } else {
    myConsole.log("sin mensaje");
  }
  return text;
};

module.exports = {
  VerifyToken,
  ReceivedMessage,
  SendMessage,
  getList,
  SendMessageTemplate
};
