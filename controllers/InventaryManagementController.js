const InventaryManagement = require("../models/InventaryManagement");
const fs = require("fs");

const getListOfInventaryManagement = async (req, res) => {
  await InventaryManagement.find({id_user:String(req.body.id_user)}).populate("product_id").populate("inventory").then(p=>  res.json(p));
};
const deleteInventaryManagement = async (req, res) => {
    const inventoryManagementId = req.body.id;
    console.log("caca"+req.body.id)
    const deletedInventoryManagement = await InventaryManagement.deleteOne({ _id: inventoryManagementId });

    if (deletedInventoryManagement.deletedCount === 0) {
      return res.status(404).json({ error: 'Inventario de gestión no encontrado' });
    }

    return res.status(200).json({ message: 'Inventario de gestión eliminado correctamente' });
  
};
const generateUniqueID = (param1, param2) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const timestamp = currentDate.getTime();
  const id = `${param1}_${param2}_${year}${month}${day}_${timestamp}`;
  return id;
};
const postInventaryManagement = (req, res) => {
  try {
   const inventory = new InventaryManagement({
    quantity: req.body.quantity,
    product_id:  req.body.product_id,
    inventory: req.body.inventory,
    id_user: req.body.id_user,  
    lote: req.body.lote,
    store: req.body.store,
    dueDateRequired: req.body.dueDateRequired,
    due_date: req.body.due_date,
    id_manager: generateUniqueID(req.body.product_id, req.body.id_user) 
  });
    inventory.save((err, inventory) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send({
        id_manager: inventory.id_manager,
        quantity: inventory.quantity,
        product_id: inventory.product_id,
        inventory: inventory.inventory,
        id_user: inventory.id_user,
        lote: inventory.lote,
        store: inventory.store,
        dueDateRequired: inventory.dueDateRequired,
        due_date: inventory.due_date
      });
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
    getListOfInventaryManagement,
    postInventaryManagement,
    deleteInventaryManagement
};
