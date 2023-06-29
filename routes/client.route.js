const expres = require("express");
const router = expres.Router();

const whatsAppController = require("../controllers/WhatsappControllers");


router
.post("/client", whatsAppController.postClient)
.post("/client/message/id", whatsAppController.getMessagesById)
.post("/client/list/id", whatsAppController.getClients)
.post("/client/id", whatsAppController.getClientInfoById)
.post("/client/archived", whatsAppController.getClientsArchived)
.put("/client/archived", whatsAppController.updateUserStatus);


module.exports = router;