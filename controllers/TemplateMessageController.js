const TemplateMessage = require("../models/TemplateMessage");
const getListOfTextProcess = async (req, res) => {
    await TemplateMessage.find({idClient:String(req.body.idClient)}).then(p=>  res.json(p));
  };
const postTemplate = (req, res) => {
  try {
   const text = new TemplateMessage({
      text: req.body.text,
      footer: req.body.footer,
      idClient: req.body.idClient,
      action: req.body.action
    });
    text.save((err,product) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send({
        text: product.text,
        footer: product.footer,
        idClient: product.idClient,
        action: product.action
      });
    });
  } catch (e) {
    myConsole.log(e);
  }
};

module.exports = { postTemplate, getListOfTextProcess };
