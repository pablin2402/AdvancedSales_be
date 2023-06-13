const fs = require("fs");
const InventaryManagement = require("../models/InventaryManagement");

const getListOfInventaryManagement = async (req, res) => {
  await InventaryManagement.find({id_user:String(req.body.id_user)}).populate("product_id").populate("inventory").then(p=>  res.json(p));
};
const postInventaryManagement = (req, res) => {
  console.log(req.body)
  try {
   const inventory = new InventaryManagement({
    id: req.body.id,
    quantity: req.body.quantity,
    product_id:  req.body.product_id,
    inventory: req.body.inventory,
    id_user: req.body.id_user,
    lote: req.body.lote,
    store: req.body.store
    });
    inventory.save((err) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
    });
  } catch (e) {
    myConsole.log(e);
  }
};

const updateManagementQuantity = async (req, res) => {
  try {
    console.log(req.body.productId);
    console.log(req.body.quantity);

    const updatedInventory = await InventaryManagement.findOneAndUpdate(
      { _id: req.body.productId },
      { quantity: req.body.quantity },
      { new: true }
    );

    if (updatedInventory) {
      console.log('Cantidad del inventario actualizada:', updatedInventory);
    } else {
      console.log('Inventario no encontrado');
    }
  } catch (error) {
    console.error('Error al actualizar la cantidad del inventario:', error);
  }
}

module.exports = {
    getListOfInventaryManagement,
    postInventaryManagement,
    updateManagementQuantity
};
