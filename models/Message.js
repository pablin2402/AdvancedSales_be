const mongoose = require("mongoose");
const { Schema } = mongoose;
const messageSchema = new Schema({
  fullMessage: { type: String, require: true },
  date: { type: Date, default: Date.now },
  recipientNumber: {type: Number, require: true},
  type: {type: String, require: true},
  number:{type: Number, require: true}, 
  id_client: { type: String, require: true },
  id_message:{ type: String, require: true },

});

module.exports = mongoose.model("Message", messageSchema);
