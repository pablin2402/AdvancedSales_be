const whatsappModel = require("../shared/whatsappmodels");
const whatsappService = require("../services/whatsappService");
const TextProcess = require("../models/TextProcess");

const getListOfTextProcess = async (idClient) => {
    return await TextProcess.find({ idClient: idClient });
};

async function Process(textUser, number){
    var models = [];

    try {
        const dbData = await getListOfTextProcess("CL-01");
        dbData.forEach(doc => {
            processDocument(doc, textUser, number, models, dbData, [],[]);
        });
        if (models.length === 0) {
            var model = whatsappModel.MessageText("No entiendo lo que dices", number);
            models.push(model);
        }
        models.forEach(model => {
            whatsappService.SendMessageWhatsApp1(model);
        });
    } catch (error) {
        console.error("Error fetching data from the database:", error);
    }
}
async function processDocument(doc, textUser, number, models, dbData, inputMessages, targetMessages) {
    const targetMessage = targetMessages.join(' ');

    if (inputMessages.some(keyword => textUser.includes(keyword))) {
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
            const childInputMessages = childDoc.inputMessage;
            const childTargetMessages = [childDoc.targetMessage];
            console.log(childInputMessages,childTargetMessages )
            processDocument(childDocument, textUser, number, models, dbData, childInputMessages, childTargetMessages);
        }
    });
}

module.exports = {
    Process
};