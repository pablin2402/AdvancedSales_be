const expres = require("express");
const router = expres.Router();

const whatsAppController = require("../controllers/WhatsappControllers");


router
.post("/client", whatsAppController.postClient)
.post("/product/list", whatsAppController.getMessagesById)
.post("/user/client", whatsAppController.getClients);


module.exports = router;