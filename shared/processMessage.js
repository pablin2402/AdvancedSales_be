const whatsappModel = require("../shared/whatsappmodels");
const whatsappService = require("../services/whatsappService");
const TextProcess = require("../models/TextProcess");
const synonymsLibrary = require("../my-synonyms-library"); 
const {removeDiacritics} = require("../utils/util")

const getListOfTextProcess = async (idClient) => {
    return await TextProcess.find({ idClient: idClient });
};

async function Process(textUser, number){
    var models = [];
    try {
        const dbData = await getListOfTextProcess("CL-01");
        dbData.forEach(doc => {
            const inputMessages = doc.inputMessage.map(keyword => keyword.toLowerCase()); 
            const parentTargetMessage = doc.targetMessage; 
            const parent2TargetMessage = doc.targetMessage2; 
            processDocument(doc, textUser, number, models, dbData, inputMessages, parentTargetMessage, parent2TargetMessage);
        });
        models.forEach(model => {
            whatsappService.SendMessageWhatsApp1(model);
        });
    } catch (error) {
        console.error("Error fetching data from the database:", error);
    }
}

async function processDocument(doc, textUser, number, models, dbData, inputMessages, targetMessage, targetMessage2) {
    const normalizedTextUser = removeDiacritics(textUser).toLowerCase();
    const synonyms = synonymsLibrary.getSynonyms(textUser);
    let addedMessage = false;
    let stopProcessing = false; // Agregamos esta variable para controlar el proceso

    if (!stopProcessing && (inputMessages.some(keyword => normalizedTextUser.includes(keyword)) ||
        synonyms.some(synonym => inputMessages.includes(synonym.toLowerCase())))) {
        var model = whatsappModel.MessageText(targetMessage, number);
        models.push(model);
        addedMessage = true;
        if (doc.messageType === "image") {
            var modelImage = whatsappModel.MessageImage(doc.link, number);
            models.push(modelImage);
            addedMessage = true;
        }
        stopProcessing = true; // Detenemos el proceso al encontrar una coincidencia
    }

    doc.children.forEach(childDoc => {
        const childDocument = dbData.find(item => item._id.toString() === childDoc.id_parent.toString());
        if (!stopProcessing && childDocument && !childDoc.processed) {
            childDoc.processed = true; 
            const childInputMessages = childDoc.inputMessage.map(keyword => keyword.toLowerCase());
            const childTargetMessage = childDoc.targetMessage;
            processDocument(childDocument, textUser, number, models, dbData, childInputMessages, childTargetMessage, targetMessage2);
        }
    });

    if (!addedMessage && targetMessage2 && !doc.parentId) {
        var model = whatsappModel.MessageText(targetMessage2, number);
        models.push(model);
    } else if (!addedMessage && !doc.parentId) {
        var model = whatsappModel.MessageText(targetMessage, number);
        models.push(model);
    }
}

module.exports = {
    Process
};
