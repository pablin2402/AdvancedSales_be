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
const getInventaryByProductId = async (req, res) =>{
  const inventary = await Inventary.find({productId:String(req.body.productId),});
  res.json(inventary);
}
module.exports = {
    getListOfInventary,
    postInventary,
    getInventaryByProductId,
};
