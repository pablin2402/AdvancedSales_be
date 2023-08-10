const Product = require("../models/Product");


const getProductsById = async (req, res) => {
  if(req.body.status === true){
    await Product.find({id_user:String(req.body.id_user), status : req.body.status}).populate("categoryId").populate("priceId").populate("inventory").then(p=>  res.json(p));
  }
  else{
    await Product.find({id_user:String(req.body.id_user)}).populate("categoryId").populate("priceId").populate("inventory").then(p=>  res.json(p));
  }
};
const deleteProduct = async (req, res) => {
  const product_id = req.body.productId;
  const deleteProduct = await Product.deleteOne({ productId: product_id });

  if (deleteProduct.deletedCount === 0) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  return res.status(200).json({ message: 'Producto eliminado correctamente' });
};
const uploadProductStatus = async (req, res) => {
  const { id_user, status, productId } = req.body;
  
    try {
      const product = await Product.findOneAndUpdate(
        { id_user: id_user, productId: productId },
        { status: status },
        { new: true }
      );
  
      if (!product) {
        return res.status(404).json({ error: 'No se encontró el product con los parámetros proporcionados' });
      }
  
      return res.json({ product });
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      res.status(500).json({ error: 'Error al actualizar el estadoxx' });
    }
}
const postProduct = (req, res) => {
  try {
   const product = new Product({
      productName: req.body.productName ,
      categoryId: req.body.categoryId,
      priceId: req.body.priceId,
      productImage: req.body.productImage,
      description: req.body.description,
      qty: req.body.qty,
      inventory: req.body.inventory,
      id_user : req.body.id_user,
      brand: req.body.brand,
      status: req.body.status,
      productId: req.body.productId
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
        qty: product.qty,
        inventory: product.inventory,
        id_user : product.id_user,
        brand: product.brand,
        status: product.status,
        productId: product.productId
      });
    });
  } catch (e) {
    myConsole.log(e);
  }
};

module.exports = {
  getProductsById,postProduct, uploadProductStatus, deleteProduct
};
