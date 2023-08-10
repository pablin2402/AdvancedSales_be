const mongoose = require("mongoose");
const { Schema } = mongoose;
const textProcess = new Schema({
  inputMessage: { type : Array , "default" : [] },
  date: { type: Date, default: Date.now },
  targetMessage: {type: String, require: true},
  idClient: { type: String, require: true },
  children: { type : Array , "default" : [] },
});

module.exports = mongoose.model("TextProcess", textProcess);
