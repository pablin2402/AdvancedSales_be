const expres = require("express");
const router = expres.Router();

const {verificarAuth} = require("../middlewares/authentication.js");
const kanbanController = require("../controllers/KanbanController");

router
.post("/kanban/list/id", kanbanController.getListOfKanban)
.post("/kanban/kanbanId", kanbanController.postKanbanByKanbanId)
.post("/kanban/create/id", kanbanController.postKanban)
.post("/kanban/id", kanbanController.findIdKanbanByClient)
.post("/kanban/user/id", kanbanController.findListOfClientsIdKanban)
.put("/kanban/id", kanbanController.updateKanban)
.delete("/kanban/id", kanbanController.deleteKanban);

module.exports = router;