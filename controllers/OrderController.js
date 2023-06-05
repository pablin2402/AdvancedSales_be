const Order = require("../models/Order");

const getOrderById = async (req, res) => {
  const orderList = await Order.find({id_owner: req.body.id_owner});
  res.json(orderList);
};
const postOrder = (req, res) => {
  try {
   const order = new Order({
    order_id: req.body.order_id,
    orderName: req.body.OrderName,
    receiveNumber:req.body.receiveNumber,
    noteAditional: req.body.noteAditional,
    color: req.body.color,
    userId: req.body.userId,
    id_owner: req.body.id_owner,
    products: req.body.products,
    dissccount: req.body.dissccount,
    tax: req.body.tax,
    totalAmount:req.body.totalAmount
    });
    order.save((err) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
    });
  } catch (e) {
    myConsole.log(e);
 }
};

module.exports = {
    getOrderById,
    postOrder,
};
