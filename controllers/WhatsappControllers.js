const fs = require("fs");
const myConsole = new console.Console(fs.createWriteStream("./sasd.txt"));
const whatsappService = require("../services/whatsappService");
const samples = require("../shared/sampleModels");
const processMessage = require("../shared/processMessage");
const whatsappModel = require("../shared/whatsappmodels");
const Message = require("../models/Message");
const User = require("../models/User");

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
      whatsappService.SendMessageWhatsApp("El usuario dijo:" + text, number);
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
const SendMessage = (req, res) => {
  
  /*var model = whatsappModel.MessageText(
    "comooooo0++" + req.body.fullMessage,
    59169501045
  );*/
  try {
    //whatsappService.SendMessageWhatsApp(model);
    const message = new Message({
      fullMessage: req.body.fullMessage,
      recipientNumber: req.body.recipientNumber,
      type: req.body.type,
      number: req.body.number,
      id_client: req.body.id_client,
      id_message:req.body.id_message,
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
};
const getClients = async (req, res) => {
  const clientList = await User.find({id_owner:String(req.body.id_owner),status:"SHOW"});
  res.json(clientList);
};
const getClientsArchived = async (req, res) => {
  const clientList = await User.find({id_owner:String(req.body.id_owner),status:"ARCHIVED"});
  res.json(clientList);
};
const getClientInfoById = async (req, res) => {
  const clientList = await User.find({id_user:String(req.body.id_user)});
  res.json(clientList);
};
const postClient = (req, res) => { 
  try {
   const clients = new User({
      name: req.body.name,
      lastName: req.body.lastName,
      profilePicture: req.body.profilePicture,
      icon: req.body.icon, 
      directionId: req.body.directionId,
      number: req.body.number, 
      company: req.body.company,
      email: req.body.email,
      socialNetwork: req.body.socialNetwork,
      notes: req.body.notes,
      id_user: req.body.id_user,
      id_owner: req.body.id_owner,
      status: "ARCHIVED"

    });
    console.log(req.body);
    clients.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send({ message: "User was registered successfully!" });
    });
  } catch (e) {
    myConsole.log(e);
  }
};
const updateUserStatus = async (req, res) => {
  const { id_user, status } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { id_user },
      { status: status },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User status updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user status', error });
  }
};
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
const getMessagesById = async (req, res) => {
  const clientList = await Message.find({id_message:String(req.body.id_message),});
  res.json(clientList);
};
module.exports = {
  VerifyToken,
  ReceivedMessage,
  SendMessage,
  getList,
  getClientInfoById,
  postClient,
  getClients,
  getMessagesById,
  getClientsArchived,
  updateUserStatus
};
