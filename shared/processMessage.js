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
      const dbDataTemplate = await getTemplateMessage("CL-01");
      dbData.forEach(doc => {
        const inputMessages = doc.inputMessage.map(keyword => keyword.toLowerCase());
        const parentTargetMessage = doc.targetMessage;
        const linkImage = ""
        const typeMessage = doc.messageType;
        template = doc.template_message;
        const parent = doc.parent;
        console.log(parent)
        processDocument(doc, textUser, number, models, dbData, inputMessages, parentTargetMessage, linkImage, typeMessage, parent, template);
      });
  
      let dataTemplate;
      dbDataTemplate.forEach(doc => {
        dataTemplate = doc;
        template = doc.template_message;
      });
      if ((models.length > 0) && template === true) {
        const messageKey = `${number}:${textUser}`;
        if (processedMessages.has(messageKey)) {
          var model = whatsappModel.MessageList(number, dataTemplate.text, dataTemplate.footer, dataTemplate);
          models.push(model);
          processedMessages.add(messageKey);
        }
      }
      models.forEach(model => {
        whatsappService.SendMessageWhatsApp1(model);
      });
      models = [];
    } catch (error) {
      console.error("Error fetching data from the database:", error);
    }
}

async function processDocument(doc, textUser, number, models, dbData, inputMessages, targetMessage, childLinkImage, childTypeMessage, parent, template) {
    const normalizedTextUser = removeDiacritics(textUser).toLowerCase();
    const synonyms = synonymsLibrary.getSynonyms(textUser);
    let addedMessage = true;
    if (addedMessage) {
      console.log(childTypeMessage, parent)
      if(childTypeMessage === "message" && parent === true && template === false){
        const messageKey = `${number}:${textUser}`;
        if (!processedMessages.has(messageKey)) {
          var model = whatsappModel.MessageText(targetMessage, number);
          models.push(model);
          processedMessages.add(messageKey);
        }
        addedMessage = false;

      }
      if (inputMessages.some(keyword => normalizedTextUser.includes(keyword)) ||
          synonyms.some(synonym => inputMessages.includes(synonym.toLowerCase()))
      ) {
        const messageKey = `${number}:${textUser}`;
        if(childTypeMessage === "message"){
          if (!processedMessages.has(messageKey)) {
            var model = whatsappModel.MessageText(targetMessage, number);
            models.push(model);
            processedMessages.add(messageKey);
          }
          addedMessage = false;

        }
        if (childTypeMessage === "image") {
          let dates = new Date();
          const messageKeys = `${number}:${textUser}:${dates}`;
          if (!processedMessages.has(messageKeys)) {
            var modelImage = whatsappModel.SampleImage(number,childLinkImage);
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
            const childTypeMessage = childDoc.messageType;
            const parent = childDoc.parent;
            const template = childDoc.template_message;
            processDocument(childDocument, textUser, number, models, dbData, childInputMessages, childTargetMessage, childLinkImage, childTypeMessage, parent, template);
        }
    });
}

module.exports = {
    Process
};
