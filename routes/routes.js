const expres = require("express");
const router = expres.Router();
const whatsAppController = require("../controllers/WhatsappControllers");
const productController = require("../controllers/ProductController");
const categoryController = require("../controllers/CategoryController");
const carrouselController = require("../controllers/CarrouselController");
const kanbanController = require("../controllers/KanbanController");
const quotationController = require("../controllers/QuotationController");
const priceController = require("../controllers/PriceController");
const inventoryController = require("../controllers/InventoryController");
const userController = require("../controllers/ClientController");
const {verificarAuth} = require("../middlewares/authentication.js");
const orderController = require("../controllers/OrderController");
const gmailController = require("../controllers/GmailController");

router
.get("/", whatsAppController.VerifyToken)
.post("/", whatsAppController.ReceivedMessage)
.post("/message", whatsAppController.SendMessage)
.get("/messagesList", verificarAuth ,whatsAppController.getList)
.post("/client", whatsAppController.postClient)
.post("/product/id", productController.getProductsById)
.post("/product", productController.postProduct)
.post("/product/list", whatsAppController.getMessagesById)
.post("/client/list", whatsAppController.getClientInfoById)
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
.get("/inventory", inventoryController.getListOfInventary)
.post("/inventory", inventoryController.postInventary)
.post("/user", userController.postNewAccount)
.post("/login", userController.getUser)
.post("/order", orderController.postOrder)
.post("/order/id", orderController.getOrderById)
.get("/mail/user/:email",gmailController.getUser)
.get("/mail/message",gmailController.getDrafts)
.get("/mail/message/id",gmailController.getMessagesById)
.post("/mail",gmailController.sendMail)
.post("/user/client", whatsAppController.getClients);

module.exports = router;