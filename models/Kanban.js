const mongoose = require("mongoose");
const { Schema } = mongoose;
const kanbanSchema = new Schema({
  title: { type: String, require: true },
  creationDate: { type: Date, default: Date.now },
  id_user: {type: String, require: true},
  tasks: { type : Array , "default" : [] },

});

module.exports = mongoose.model("Kanban", kanbanSchema);
