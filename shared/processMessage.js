const whatsappModel = require("../shared/whatsappmodels");
const whatsappService = require("../services/whatsappService");
const TextProcess = require("../models/TextProcess");
const synonymsLibrary = require("../my-synonyms-library"); 
const {removeDiacritics} = require("../utils/util")

const getListOfTextProcess = async (idClient) => {
    return await TextProcess.find({ idClient: idClient });
};
const findDefaultChildTargetMessage = (doc) => {
    const defaultChild = doc.children.find(child => child.type_message === "Default");
    if (defaultChild) {
        console.log(defaultChild)
        return defaultChild.targetMessage;
    } else {
        return null;
    }
};

async function Process(textUser, number){
    var models = [];

    try {
        const dbData = await getListOfTextProcess("CL-01");
        dbData.forEach(doc => {
            const inputMessages = doc.inputMessage.map(keyword => keyword.toLowerCase()); 
            const targetMessage = doc.targetMessage; 
            const defaultMessage = findDefaultChildTargetMessage(doc);
            console.log(defaultMessage)
            processDocument(doc, textUser, number, models, dbData, inputMessages, targetMessage, defaultMessage);
        });
     
        models.forEach(model => {
            whatsappService.SendMessageWhatsApp1(model);
        });
    } catch (error) {
        console.error("Error fetching data from the database:", error);
    }
}

async function processDocument(doc, textUser, number, models, dbData, inputMessages, targetMessage, defaultMessage) {
    const normalizedTextUser = removeDiacritics(textUser).toLowerCase();
    const synonyms = synonymsLibrary.getSynonyms(textUser);
    if (inputMessages.some(keyword => normalizedTextUser.includes(keyword))
    ||
        synonyms.some(synonym => inputMessages.includes(synonym.toLowerCase()) )
    ) {
        var model = whatsappModel.MessageText(targetMessage, number);
        models.push(model);
        if (doc.messageType === "image") {
            var modelImage = whatsappModel.MessageImage(doc.link, number);
            models.push(modelImage);
        }
    }
    else if (defaultMessage !== null) {
        var model = whatsappModel.MessageText(defaultMessage, number);
        models.push(model);
    }

    doc.children.forEach(childDoc => {
        const childDocument = dbData.find(item => item._id.toString() === childDoc.id_parent.toString());
        if (childDocument && !childDoc.processed) {
            childDoc.processed = true; 
            const childInputMessages = childDoc.inputMessage.map(keyword => keyword.toLowerCase());
            const childTargetMessage = childDoc.targetMessage;
            processDocument(childDocument, textUser, number, models, dbData, childInputMessages, childTargetMessage);
        }
    });
}

module.exports = {
    Process
};
