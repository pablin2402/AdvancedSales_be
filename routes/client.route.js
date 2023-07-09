const expres = require("express");
const router = expres.Router();

const clientController = require("../controllers/ClientController");


router
.post("/client", clientController.postClient)
.post("/client/message/id", clientController.getMessagesById)
.post("/client/list/id", clientController.getClients)
.post("/client/id", clientController.getClientInfoById)
.post("/client/archived", clientController.getClientsArchived)
.put("/client/archived", clientController.updateUserStatus);


module.exports = router;