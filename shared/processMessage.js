const whatsappModel = require("../shared/whatsappmodels");
const whatsappService = require("../services/whatsappService");
const TextProcess = require("../models/TextProcess");

const getListOfTextProcess = async (idClient) => {
    return await TextProcess.find({ idClient: idClient });
};

async function Process(textUser, number){
    textUser = textUser.toLowerCase();
    var models = [];

    try {
        const dbData = await getListOfTextProcess("CL-01");
        console.log(dbData)
        dbData.forEach(doc => {
            processDocument(doc, textUser, number, models, dbData);
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
async function processDocument(doc, textUser, number, models, dbData) {
    const inputMessages = doc.inputMessage;
    const targetMessage = doc.targetMessage;
    console.log(inputMessages, targetMessage)

    if (inputMessages.some(keyword => textUser.includes(keyword))) {
        var model = whatsappModel.MessageText(targetMessage, number);
        models.push(model);

        if (doc.messageType === "image") {
            var modelImage = whatsappModel.MessageImage(doc.link, number);
            models.push(modelImage);
        }
    }

    doc.children.forEach(childDoc => {
        const childDocument = dbData.find(item => item._id === childDoc.targetId);
        if (childDocument) {
            processDocument(childDocument, textUser, number, models, dbData);
        }
    });
}
module.exports = {
    Process
};