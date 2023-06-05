const mongoose = require("mongoose");
const { Schema } = mongoose;

const producytSchema = new Schema({
  productName: { type: String, require: true },
  categoryId: { type: Schema.ObjectId, ref: "Category" },
  priceId: { type: Schema.ObjectId, ref:"Price" },
  productImage: { type: String, require: true },
  quantity: { type: Number, require: true },
  description: { type: String, require: true },
  inventory: { type: Schema.ObjectId, ref:"Inventory" },
  id_user: { type: String, require: true },

});

module.exports = mongoose.model("Product", producytSchema);
