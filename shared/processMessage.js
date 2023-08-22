const whatsappModel = require("../shared/whatsappmodels");
const whatsappService = require("../services/whatsappService");
const TextProcess = require("../models/TextProcess");
const synonymsLibrary = require("../my-synonyms-library"); 
const {removeDiacritics} = require("../utils/util")

const getListOfTextProcess = async (idClient) => {
    return await TextProcess.find({ idClient: idClient });
};
const findDefaultChildTargetMessage = async () => {
    try {
        const parentDocument = await TextProcess.findById("64d087f3a573840044e93d9d");
        let defaultChild = parentDocument.children.find(child => child.type_message === "Default");
        if (defaultChild) {
            return defaultChild.targetMessage;
        }
    } catch (error) {
        console.error("Error finding default child target message:", error);
        return null;
    }
};


async function Process(textUser, number){
    var models = [];

    try {
        const dbData = await getListOfTextProcess("CL-01");
        let defaultMessage = await findDefaultChildTargetMessage();
        console.log(defaultMessage)
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
