const whatsappModel = require("../shared/whatsappmodels");
const whatsappService = require("../services/whatsappService");
const TextProcess = require("../models/TextProcess");
const synonymsLibrary = require("../my-synonyms-library"); 
const {removeDiacritics} = require("../utils/util")
const TemplateMessage = require("../models/TemplateMessage");
const { text } = require("body-parser");

const getListOfTextProcess = async (idClient) => {
    return await TextProcess.find({ idClient: idClient });
};

const getTemplateMessage = async (idClient) => {
    return await TemplateMessage.find({ idClient: idClient });
};
const processedMessages = new Set();

async function Process(textUser, number) {
    var models = [];
    var template = false;
  
    try {
      const dbData = await getListOfTextProcess("CL-01");
      const dbDataTemplate = await getTemplateMessage("CL-01");
      dbData.forEach(doc => {
        console.log(doc.inputMessage)
        const inputMessages = doc.inputMessage.map(keyword => keyword.toLowerCase());
        const parentTargetMessage = doc.targetMessage;
        const linkImage = ""
        const typeMessage = ""
        template = doc.template_message;
        processDocument(doc, textUser, number, models, dbData, inputMessages, parentTargetMessage, linkImage, typeMessage);
      });
  
      let dataTemplate;
      dbDataTemplate.forEach(doc => {
        dataTemplate = doc;
        template = doc.template_message;
      });

      if (!models.length && template === true) {
        const messageKey = `${number}:${textUser}`;
        console.log(messageKey)
        if (!processedMessages.has(messageKey)) {
          var model = whatsappModel.MessageList(number, dataTemplate.text, dataTemplate.footer, dataTemplate);
          models.push(model);
          processedMessages.add(messageKey);
        }
      }
      models.forEach(model => {
        whatsappService.SendMessageWhatsApp1(model);
      });
      models = [];
      console.log(models)
    } catch (error) {
      console.error("Error fetching data from the database:", error);
    }
}

async function processDocument(doc, textUser, number, models, dbData, inputMessages, targetMessage) {
    const normalizedTextUser = removeDiacritics(textUser).toLowerCase();
    const synonyms = synonymsLibrary.getSynonyms(textUser);
    let addedMessage = true;
    if (addedMessage) {
      if (inputMessages.some(keyword => normalizedTextUser.includes(keyword)) ||
          synonyms.some(synonym => inputMessages.includes(synonym.toLowerCase()))
      ) {
        let date = new Date();
        const messageKey = `${number}:${textUser}`;

        if(doc.messageType === "message"){
          console.log("entre")
          if (!processedMessages.has(messageKey)) {
            var model = whatsappModel.MessageText(targetMessage, number);
            models.push(model);
            processedMessages.add(messageKey);
          }
          addedMessage = false;

        }
        if (doc.messageType === "image") {
          console.log("imagen")

          let dates = new Date();
          const messageKeys = `${number}:${textUser}:${dates}`;
          if (!processedMessages.has(messageKeys)) {
            console.log("caca")
            var modelImage = whatsappModel.SampleImage(number,"https://www.tooltyp.com/wp-content/uploads/2014/10/1900x920-8-beneficios-de-usar-imagenes-en-nuestros-sitios-web.jpg");
            models.push(modelImage);
            processedMessages.add(messageKeys);
          }
          addedMessage = false;
        }
      }
    }

    doc.children.forEach(childDoc => {
        const childDocument = dbData.find(item => item._id.toString() === childDoc.id_parent.toString());
        if (childDocument && !childDoc.processed) {
            childDoc.processed = true; 
            const childInputMessages = childDoc.inputMessage.map(keyword => keyword.toLowerCase());
            const childTargetMessage = childDoc.targetMessage;
            const childLinkImage = childDoc.link;
            const childTypeMessage = childDoc.template_message;

            processDocument(childDocument, textUser, number, models, dbData, childInputMessages, childTargetMessage, childLinkImage, childTypeMessage);
        }
    });
}

module.exports = {
    Process
};
