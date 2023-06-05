const fs = require("fs");
const Kanban = require("../models/Kanban");

const getListOfKanban = async (req, res) => {
  const Kanbans = await Kanban.find();
  res.json(Kanbans);
};
const postKanban = (req, res) => { 
  try {
   const kanban = new Kanban({
      title: req.body.title,
      id_user: req.body.id_user,
      tasks: req.body.tasks,
    });
    kanban.save((err) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
    });
  } catch (e) {
    myConsole.log(e);
  }
};
const postKanbanByKanbanId = async (req, res) => {    
  const kanban =  await Kanban.findOne({id_kanban: req.body.id_kanban});
  console.log(kanban)
  if (!kanban.tasks) {
    kanban.tasks = []; // Inicializar la lista si está indefinida
  }
  kanban.tasks = kanban.tasks.concat(req.body.tasks);
  console.log(kanban)
  await kanban.save();
};
const updateKanban = async (req, res) => {
  console.log( req.body.id_kanban);
  console.log( req.body.id_client);
  console.log( req.body.id_kanban_new);

  const kanban =  await Kanban.find({id_kanban: req.body.id_kanban});
    if(kanban)
    {
        const indice = kanban[0].tasks.findIndex((elemento) => elemento.id_client === req.body.id_client);
        const elemementToMove = kanban[0].tasks[indice];
        const update = await Kanban.updateOne(
          { id_kanban: req.body.id_kanban_new },
          { $addToSet: { tasks: elemementToMove }}
        );
        await Kanban.updateOne(
          { id_kanban: req.body.id_kanban },
          { $pull: {tasks: { id_client: req.body.id_client }}}
        );
        res.json(update)
   }     
};
const deleteKanban = async (req, res) => {    
  const kanban =  await Kanban.find({id_kanban: req.body.id_kanban});
  if(kanban){
    const update = await Kanban.updateOne(
      { id_kanban: req.body.id_kanban },
      { $pull: {tasks: { id_client: req.body.id_client }}}
    );
    res.json(update)
  }     
};
const findIdKanbanByClient = async (req, res) => {
  try {
    const kanban = await Kanban.findOne({ "tasks.id_client": req.body.id_client });
    if (!kanban) {
      throw new Error('Kanban no encontrado o tarea no encontrada');
    }
    res.json(kanban)
  } catch (error) {
    console.error('Error al encontrar el kanban:', error);
  }
};
module.exports = {
  getListOfKanban, postKanban, updateKanban,deleteKanban, findIdKanbanByClient, postKanbanByKanbanId
};