const mongoose = require("mongoose");
const { Schema } = mongoose;

const producytSchema = new Schema({
  productName: { type: String, require: true },
  categoryId: { type: Schema.ObjectId, ref: "Category" },
  priceId: { type: Schema.ObjectId, ref:"Price" },
  productImage: { type: String, require: true },
  qty: { type: Number, require: true },
  description: { type: String, require: true },
  inventory: { type: Schema.ObjectId, ref:"Inventory" },
  id_user: { type: String, require: true },
  creationDate: { type: Date, default: Date.now },
  brand: { type: String, require: true },
  productId: { type: String, require: true },
  status: { type: Boolean, require: true },
  buttonStatus: { type: Boolean, require: true },
  addDisscount: { type: Number, require: true },
  extra: { type: Number, require: true },

});

module.exports = mongoose.model("Product", producytSchema);
