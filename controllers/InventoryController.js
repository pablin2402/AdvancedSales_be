const fs = require("fs");
const Inventory = require("../models/Inventory");

const getListOfInventary = async (req, res) => {
  const inventory = await Inventory.find();
  res.json(inventory);
};
const postInventary = (req, res) => {
  try {
   const inventory = new Inventory({
    productId: req.body.productId,
    userId: req.body.userId,
    quantity:  req.body.quantity,
    dueDate:  req.body.dueDate,
    dueDateRequired:  req.body.dueDateRequired,
    store: req.body.store,
    });
    inventory.save((err, inventory) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send({
        productId: inventory.productId,
        userId: inventory.userId,
        quantity:  inventory.quantity,
        dueDate:  inventory.dueDate,
        dueDateRequired:  inventory.dueDateRequired,
        store: inventory.store,
        id: inventory._id
      });
    });
  } catch (e) {
     console.log(e);
  }
};
const getInventaryByProductId = async (req, res) =>{
  const inventary = await Inventory.findOne({productId:String(req.body.productId),});
  res.json(inventary);
}

const updateQuantity = async (req, res) => {
  console.log(req.body)
  try {
    const updatedProduct = await Inventory.findOneAndUpdate(
      { productId: req.body.productId },
      { quantity: req.body.quantity },
      { new: true }
    );
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error al actualizar la cantidad del inventario:', error);
  }
}

module.exports = {
    getListOfInventary,
    postInventary,
    getInventaryByProductId,
    updateQuantity
};
