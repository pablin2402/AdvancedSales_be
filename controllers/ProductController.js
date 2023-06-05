const Product = require("../models/Product");


const getProductsById = async (req, res) => {
  await Product.find({id_user:String(req.body.id_user)}).populate("categoryId").populate("priceId").populate("inventory").then(p=>  res.json(p));
};
const postProduct = (req, res) => {
  try {
   const product = new Product({
      productName: req.body.productName ,
      categoryId: req.body.categoryId,
      priceId: req.body.priceId,
      productImage: req.body.productImage,
      description: req.body.description,
      quantity: req.body.quantity,
      inventory: req.body.inventory,
      id_user : req.body.id_user
    });
    product.save((err,product) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send({
        productName: product.productName ,
        categoryId: product.categoryId,
        priceId: product.priceId,
        productImage: product.productImage,
        description: product.description,
        quantity: product.quantity,
        inventory: product.inventory,
        id_user : product.id_user,
      });
    });
  } catch (e) {
    myConsole.log(e);
  }
};
module.exports = {
  getProductsById,postProduct
};
