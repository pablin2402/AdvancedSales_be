const whatsappModel = require("../shared/whatsappmodels");
const whatsappService = require("../services/whatsappService");
const TextProcess = require("../models/TextProcess");
const synonymsLibrary = require("../my-synonyms-library"); 
const {removeDiacritics} = require("../utils/util")
const TemplateMessage = require("../models/TemplateMessage");

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
      const dbDataTemplate = await getTemplateMessage("CL-02");
  
      dbData.forEach(doc => {
        const inputMessages = doc.inputMessage.map(keyword => keyword.toLowerCase());// hola, olo
        const parentTargetMessage = doc.targetMessage;// hola que
        template = doc.template_message;// false 
        processDocument(doc, textUser, number, models, dbData, inputMessages, parentTargetMessage);
      });
  
      let dataTemplate;
      dbDataTemplate.forEach(doc => {
        dataTemplate = doc;
        template = doc.template_message;
      });
  
      if (!models.length && template === "R") {
        const messageKey = `${number}:${textUser}`;
        if (!processedMessages.has(messageKey)) {
          var model = whatsappModel.MessageList(number, dataTemplate.text, dataTemplate.footer, dataTemplate);
          models.push(model);
            processedMessages.add(messageKey);
        }
      }
      models.forEach(model => {
        whatsappService.SendMessageWhatsApp1(model);
      });
    } catch (error) {
      console.error("Error fetching data from the database:", error);
    }
  }

async function processDocument(doc, textUser, number, models, dbData, inputMessages, targetMessage) {
    const normalizedTextUser = removeDiacritics(textUser).toLowerCase();//remueve acentos
    const synonyms = synonymsLibrary.getSynonyms(textUser);//obtiene sinonimos
    let addedMessage = doc.processed;
    if(addedMessage){
      if (inputMessages.some(keyword => normalizedTextUser.includes(keyword)) ||
      synonyms.some(synonym => inputMessages.includes(synonym.toLowerCase()) )
      ) {
          var model = whatsappModel.MessageText(targetMessage, number);
          models.push(model);
          addedMessage = false;
          if (doc.messageType === "image") {
              var modelImage = whatsappModel.MessageImage(doc.link, number);
              models.push(modelImage);
              addedMessage = false;
          }
      }
    }
    doc.children.forEach(childDoc => {
        const childDocument = dbData.find(item => item._id.toString() === childDoc.id_parent.toString());
        console.log(childDoc)
        if (childDocument && !childDoc.processed) {
            childDoc.processed = true; 
            const childInputMessages = childDoc.inputMessage.map(keyword => keyword.toLowerCase());
            console.log(childInputMessages)
            const childTargetMessage = childDoc.targetMessage;
            processDocument(childDocument, textUser, number, models, dbData, childInputMessages, childTargetMessage);
        }
    });
}
module.exports = {
    Process
};
