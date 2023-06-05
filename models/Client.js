const mongoose = require("mongoose");
const { Schema } = mongoose;

const roles = {
    values: ['ADMIN', 'USER'],
    message: '{VALUE} no es un rol válido'
}
const userSchema = new Schema({
    fullName:   { type: String, required: [true, 'El nombre es necesario'] },
    lastName:   { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'Email es necesario'] },
    password: { type: String, required: [true, 'Pass es necesario'] },
    creationDate: { type: Date, default: Date.now },
    role: { type: String, default: 'USER', enum: roles },
    active: { type: Boolean, default: true },
    id_owner: { type: String, require: true },
});

module.exports = mongoose.model("Client", userSchema);
