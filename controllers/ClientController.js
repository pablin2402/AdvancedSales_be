const Client = require("../models/Client");
const User = require("../models/User");
const Message = require("../models/Message");

const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const postNewAccount = (req, res) => {
  try {
   const client = new Client({
        fullName: req.body.fullName,
        lastName:req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, saltRounds),
        role: req.body.role,
        id_owner: req.body.id_owner
    });
    client.save((err,client) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
    });
  } catch (e) {
    myConsole.log(e);
  }
};
const getUser = async (req, res) =>{
    try {
        const usuarioDB = await Client.findOne({email: req.body.email});
    
        if(!usuarioDB){
          return res.status(400).json({
            mensaje: 'Usuario! o contraseña inválidos',
          });
        }
        if( !bcrypt.compareSync(req.body.password, usuarioDB.password) ){
          return res.status(400).json({
            mensaje: 'Usuario o contraseña! inválidos',
          });
        }
        let token = jwt.sign({
            data: usuarioDB
          }, 'secret', { expiresIn: 60 * 60 * 24 * 30});

        return res.json({
          usuarioDB,
          token: token
        })
        
      } catch (error) {
        return res.status(400).json({
          mensaje: 'Ocurrio un error',
          error
        });
      }
};
const getClients = async (req, res) => {
  const clientList = await User.find({id_owner:String(req.body.id_owner),status:"SHOW"});
  res.json(clientList);
};
const getClientsArchived = async (req, res) => {
  const clientList = await User.find({id_owner:String(req.body.id_owner),status:"ARCHIVED"});
  res.json(clientList);
};
const getClientInfoById = async (req, res) => {
  const clientList = await User.find({id_user:String(req.body.id_user)});
  res.json(clientList);
};
const updateUserFile = async (req, res) => {
  const { id_user, name, lastName, number, company, email, directionId  } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { id_user },
      { 
        name: name,
        lastName: lastName,
        number: number,
        company: company,
        email: email,
        directionId: directionId        
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User status updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user status', error });
  }
};
const postClient = (req, res) => { 
  try {
   const clients = new User({
      name: req.body.name,
      lastName: req.body.lastName,
      profilePicture: req.body.profilePicture,
      icon: req.body.icon, 
      directionId: req.body.directionId,
      number: req.body.number, 
      company: req.body.company,
      email: req.body.email,
      socialNetwork: req.body.socialNetwork,
      notes: req.body.notes,
      id_user: req.body.id_user,
      id_owner: req.body.id_owner,
      status: "SHOW",
      identityNumber: req.body.identityNumber

    });
    clients.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send({ message: "User was registered successfully!" });
    });
  } catch (e) {
    myConsole.log(e);
  }
};
const updateUserStatus = async (req, res) => {
  const { id_user, status } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { id_user },
      { status: status },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User status updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user status', error });
  }
};
const getMessagesById = async (req, res) => {
  const clientList = await Message.find({id_client:String(req.body.id_client)});
  res.json(clientList);
};
const deleteClient = async (req, res) => {
  const userId = req.body.id_user;
  const deleteProduct = await User.deleteOne({ id_user: userId });

  if (deleteProduct.deletedCount === 0) {
    return res.status(404).json({ error: 'Cliente no encontrado' });
  }
  return res.status(200).json({ message: 'Cliente eliminado correctamente' });
};
module.exports = {
  postNewAccount, getUser, getClients, getClientsArchived,getMessagesById, getClientInfoById, postClient, updateUserFile,updateUserStatus, deleteClient
};
