const expres = require("express");
const router = expres.Router();

const inventoryController = require("../controllers/InventoryController");
const {verificarAuth} = require("../middlewares/authentication.js");
const inventaryManagementController = require("../controllers/InventaryManagementController");

router
.get("/inventory", inventoryController.getListOfInventary)
.post("/inventory", inventoryController.postInventary)
.put("/inventory/id", inventoryController.updateQuantity)
.post("/inventoryManagement/userid", inventaryManagementController.getListOfInventaryManagement)
.post("/inventoryManagement/id", inventaryManagementController.postInventaryManagement)

module.exports = router;