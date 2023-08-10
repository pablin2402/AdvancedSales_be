const fs = require("fs");
const Kanban = require("../models/Kanban");

const getListOfKanban = async (req, res) => {
  await Kanban.find({id_owner:String(req.body.id_owner)}).then(p=>  res.json(p));
};
const findListOfClientsIdKanban = async (req, res) => {
  const kanban = await Kanban.findOne({id_kanban: req.body.id_kanban});
  const tasks = kanban.tasks.map(task => ({
    id_user: task.id_user,
    name: task.name,
    lastName: task.lastName

  }));
  
  res.json(tasks);
};
const postKanban = (req, res) => { 
  try {
   const kanban = new Kanban({
      title: req.body.title,
      id_owner: req.body.id_owner,
      tasks: req.body.tasks,
      id_kanban: req.body.id_kanban,
      color: req.body.color,
    });
    kanban.save((err,kanban) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send({
        title: kanban.title,
        id_owner: kanban.id_owner,
        tasks: kanban.tasks,
        id_kanban: kanban.id_kanban,
        creationDate: kanban.creationDate,
        color: kanban.color
      });
    });
  } catch (e) {
    myConsole.log(e);
  }
};
const postKanbanByKanbanId = async (req, res) => {
  try {
    const kanban = await Kanban.findOne({ id_kanban: String(req.body.id_kanban) });
    if (kanban) {
      kanban.tasks.push(req.body.tasks);
      await kanban.save((err,kanban) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.status(200).send({
          title: kanban.title,
          id_owner: kanban.id_owner,
          tasks: kanban.tasks,
          id_kanban: kanban.id_kanban,
          creationDate: kanban.creationDate,
          color: kanban.color
        });
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateKanban = async (req, res) => {
  const kanban =  await Kanban.find({id_kanban: req.body.id_kanban});
    if(kanban)
    {
        const indice = kanban[0].tasks.findIndex((elemento) => elemento.id_user === req.body.id_user);
        const elemementToMove = kanban[0].tasks[indice];
        const update = await Kanban.updateOne(
          { id_kanban: req.body.id_kanban_new },
          { $addToSet: { tasks: elemementToMove }}
        );
        await Kanban.updateOne(
          { id_kanban: req.body.id_kanban },
          { $pull: {tasks: { id_user: req.body.id_user }}}
        );
        res.json(update)
   }     
};
const findIdKanbanByClient = async (req, res) => {
  try {
    const kanban = await Kanban.findOne({ "tasks.id_user": req.body.id_user });
    res.json(kanban);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar el ID de Kanban por cliente" });
  }
};
const deleteKanban = async (req, res) => {
  const idKanban= req.body.id_kanban;
  
  try {
    const deletedKanban = await Kanban.deleteOne({ id_kanban: idKanban });
    console.log(deleteKanban)
    if (!deletedKanban) {
      return res.status(404).json({ message: "No se encontró el kanban con los parámetros dados." });
    }
    return res.status(200).json({ message: 'Kanban eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el kanban" });
  }
};

module.exports = {
  getListOfKanban, postKanban, updateKanban,deleteKanban, findIdKanbanByClient, postKanbanByKanbanId,findListOfClientsIdKanban
};