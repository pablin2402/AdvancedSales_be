const Order = require("../models/Order");

const getOrderById = async (req, res) => {
  const orderList = await Order.find({id_owner: req.body.id_owner});
  res.json(orderList);
};
const getOrderByIdAndClient = async (req, res) => {
  const orderList = await Order.find({id_owner: req.body.id_owner, userId: req.body.userId});
  res.json(orderList);
};
const postOrder = (req, res) => {
  console.log(req.body.clientName)
  try {
   const order = new Order({
    order_id: req.body.order_id,
    orderName: req.body.OrderName,
    receiveNumber:req.body.receiveNumber,
    noteAditional: "",
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
    zona: "",
    city: "",
    clientName: req.body.clientName,
    accountStatus: req.body.accountStatus,
    dueDate: req.body.dueDate,
    earnMoney: req.body.earnMoney,
    id_client: req.body.id_client,
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
        accountStatus: order.accountStatus,
        dueDate: order.dueDate,
        earnMoney: order.earnMoney,
        id_client: order.id_client,
        clientName: order.clientName
      });
    });
  } catch (e) {
    myConsole.log(e);
 }
};
const deleteOrder = async (req, res) => {
  console.log(req.body.order_id)
  const order_id = req.body.order_id;
  const deleteProduct = await Order.deleteOne({ order_id: order_id });

  if (deleteProduct.deletedCount === 0) {
    return res.status(404).json({ error: 'Orden no encontrado' });
  }
  return res.status(200).json({ message: 'Orden eliminado correctamente' });
};

module.exports = {
    getOrderById,
    getOrderByIdAndClient,
    postOrder,
    deleteOrder
};
