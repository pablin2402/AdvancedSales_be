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
    userId: req.body.userId,
    id_owner: req.body.id_owner,
    products: req.body.products,
    dissccount: req.body.dissccount,
    tax: req.body.tax,
    totalAmount:req.body.totalAmount,
    nit: req.body.nit,
    razonSocial: req.body.razonSocial,
    cellphone: req.body.cellphone,
    direction: req.body.direction,
    zona: req.body.zona,
    city: req.body.city,
    });
    order.save((err,order) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send({
        order_id: order.order_id,
        orderName: order.OrderName,
        receiveNumber: order.receiveNumber,
        noteAditional: order.noteAditional,
        userId: order.userId,
        id_owner: order.id_owner,
        products: order.products,
        dissccount: order.dissccount,
        tax: order.tax,
        totalAmount:order.totalAmount,
        nit: order.nit,
        razonSocial: order.razonSocial,
        cellphone: order.cellphone,
        direction: order.direction,
        zona: order.zona,
        city: order.city,
      });
    });
  } catch (e) {
    myConsole.log(e);
 }
};

module.exports = {
    getOrderById,
    postOrder,
};
