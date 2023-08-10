const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const cron = require('node-cron');

const disparadorSchema = new mongoose.Schema({
  currentDate: Date,
  dailyHour: String,
  messageToSent: String,
  id_owner: String,
  id_kanban: String,
  triggerStatus: { type: Boolean, require: true },
  dailysentStatus: { type: Boolean, require: true },
});

const Disparador = mongoose.model('Disparador', disparadorSchema);

async function iniciarDisparadoresProgramados() {
  while (true) {
    try {
      const disparadores = await Disparador.find();
      disparadores.forEach((disparador) => {
        const { currentDate, dailyHour, messageToSent, triggerStatus, dailysentStatus } = disparador;

        const horaActual = new Date().getHours();
        const minutosActual = new Date().getMinutes();
        const horaProgramada = new Date(dailyHour).getHours();
        const minutosActualProgramada = new Date(dailyHour).getMinutes();

        if (horaActual === parseInt(horaProgramada, 10) && minutosActual === parseInt(minutosActualProgramada, 10) && triggerStatus ===true && dailysentStatus ===true ) {
          console.log('Enviando mensaje:', messageToSent);
        }
      });
      console.log('Disparadores programados verificados');
      await new Promise(resolve => setTimeout(resolve, 900000));
    } catch (error) {
      console.error('Error al verificar los disparadores programados:', error);
    }
  }
}
cron.schedule('*/15 * * * *', () => {
    iniciarDisparadoresProgramados();
  });

router.post('/disparadores', async (req, res) => {
  try {
    const disparador = new Disparador({
        currentDate: req.body.currentDate,
        dailyHour: req.body.dailyHour,
        messageToSent: req.body.messageToSent,
        triggerStatus : req.body.triggerStatus,
        dailysentStatus: req.body.dailysentStatus,
        id_owner: req.body.id_owner,
        id_kanban : req.body.id_kanban
    });

    await disparador.save();
    res.status(200).json({ message: 'Disparador creado' });
  } catch (error) {
    console.error('Error al crear el dispar/ ador:', error);
    res.status(500).json({ error: 'Error al crear el disparador' });
  }
});

router.post('/disparadores/list', async (req, res) => {
    const { id_owner, id_kanban } = req.body;
    try {
      const disparadores = await Disparador.find({ id_owner: id_owner, id_kanban });
      res.json({ disparadores });
    } catch (error) {
      console.error('Error al obtener los disparadores:', error);
      res.status(500).json({ error: 'Error al obtener los disparadores' });
    }
  });
  
  router.put('/disparadores/upload', async (req, res) => {
    const { id_owner, id_kanban, id_trigger, triggerStatus } = req.body;
  
    try {
      const disparador = await Disparador.findOneAndUpdate(
        { id_trigger: id_trigger, id_owner: id_owner, id_kanban: id_kanban },
        { triggerStatus: triggerStatus },
        { new: true }
      );
  
      if (!disparador) {
        return res.status(404).json({ error: 'No se encontró el disparador con los parámetros proporcionados' });
      }
  
      return res.json({ disparador });
    } catch (error) {
      console.error('Error al actualizar el triggerStatus:', error);
      res.status(500).json({ error: 'Error al actualizar el triggerStatus' });
    }
  });
module.exports = router;
