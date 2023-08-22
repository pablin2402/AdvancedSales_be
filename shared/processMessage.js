const whatsappModel = require("../shared/whatsappmodels");
const whatsappService = require("../services/whatsappService");
const TextProcess = require("../models/TextProcess");
const synonymsLibrary = require("../my-synonyms-library"); 
const {removeDiacritics} = require("../utils/util")

const getListOfTextProcess = async (idClient) => {
    return await TextProcess.find({ idClient: idClient });
};
const getDefaultMessageFromDB = async () => {
    try {
        const defaultMessage = await TextProcess.findOne({ 'children.type_message': "Default" });
        console.log(defaultMessage)
        if (defaultMessage) {
            console.log(defaultMessage)
            return defaultMessage.targetMessage;
        } else {
            return "Mensaje por defecto cuando no se entiende";
        }
    } catch (error) {
        console.error("Error fetching default message from the database:", error);
        return "Mensaje por defecto cuando no se entiende";
    }
};

async function Process(textUser, number){
    var models = [];

    try {
        const dbData = await getListOfTextProcess("CL-01");
        const defaultMessage = await getDefaultMessageFromDB();

        dbData.forEach(doc => {
            const inputMessages = doc.inputMessage.map(keyword => keyword.toLowerCase()); 
            const targetMessage = doc.targetMessage; 
            processDocument(doc, textUser, number, models, dbData, inputMessages, targetMessage);
        });
        if (models.length === 0) {
            var model = whatsappModel.MessageText(defaultMessage, number);
            models.push(model);
        }
        models.forEach(model => {
            whatsappService.SendMessageWhatsApp1(model);
        });
    } catch (error) {
        console.error("Error fetching data from the database:", error);
    }
}

async function processDocument(doc, textUser, number, models, dbData, inputMessages, targetMessage) {
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
