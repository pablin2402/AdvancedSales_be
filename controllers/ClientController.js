const Client = require("../models/Client");

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
}

module.exports = {
  postNewAccount, getUser
};
