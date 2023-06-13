const expres = require("express");
const router = expres.Router();
const whatsAppController = require("../controllers/WhatsappControllers");
const productController = require("../controllers/ProductController");
const categoryController = require("../controllers/CategoryController");
const carrouselController = require("../controllers/CarrouselController");
const kanbanController = require("../controllers/KanbanController");
const quotationController = require("../controllers/QuotationController");
const priceController = require("../controllers/PriceController");
const userController = require("../controllers/ClientController");
const {verificarAuth} = require("../middlewares/authentication.js");
const orderController = require("../controllers/OrderController");
const gmailController = require("../controllers/GmailController");

router
.get("/", whatsAppController.VerifyToken)
.post("/", whatsAppController.ReceivedMessage)
.post("/message", whatsAppController.SendMessage)
.get("/messagesList", verificarAuth ,whatsAppController.getList)
.post("/product/id", productController.getProductsById)
.post("/product", productController.postProduct)
.get("/kanban", kanbanController.getListOfKanban)
.post("/kanban/kanbanId", kanbanController.postKanbanByKanbanId)
.post("/kanban/id", kanbanController.findIdKanbanByClient)
.put("/kanban/id", kanbanController.updateKanban)
.delete("/kanban/id", kanbanController.deleteKanban)
.post("/category/id", categoryController.getCategory)
.post("/category", categoryController.postCategory)
.get("/carrousel", carrouselController.getCarrousel)
.get("/quotation", quotationController.getQuotation)
.post("/quotation", quotationController.postQuotation)
.post("/price/product", priceController.getPriceByProductId)
.post("/price", priceController.postPrice)
.post("/user", userController.postNewAccount)
.post("/login", userController.getUser)
.post("/order", orderController.postOrder)
.post("/order/id", orderController.getOrderById)
.get("/mail/user/:email",gmailController.getUser)
.get("/mail/message",gmailController.getDrafts)
.get("/mail/message/id",gmailController.getMessagesById)
.post("/mail/message/id",gmailController.deleteMessagesById)
.post("/mail/message/key",gmailController.findMessagesByKeyMessage)
.post("/mail",gmailController.sendMail)
.post("/mail/body/id",gmailController.getBodyMessage)

module.exports = router;