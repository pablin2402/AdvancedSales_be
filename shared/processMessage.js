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
async function Process(textUser, number){
    var models = [];
    var template = false;

    try {
        const dbData = await getListOfTextProcess("CL-01");
        const dbDataTemplate = await getTemplateMessage("CL-02");

        dbData.forEach(doc => {
            const inputMessages = doc.inputMessage.map(keyword => keyword.toLowerCase()); 
            const parentTargetMessage = doc.targetMessage; 
            template = doc.template_message;
            processDocument(doc, textUser, number, models, dbData, inputMessages, parentTargetMessage);
        });
        let dataTemplate;
        dbDataTemplate.forEach(doc => {
            dataTemplate = doc;
            template = doc.template_message;
        });
        console.log(!models.length)
        console.log(models)
        if(!models.length){
            if(template === "R"){
                var model = whatsappModel.MessageList(number, dataTemplate.text, dataTemplate.footer, dataTemplate);
                models.push(model);        
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
    const normalizedTextUser = removeDiacritics(textUser).toLowerCase();
    const synonyms = synonymsLibrary.getSynonyms(textUser);
    let addedMessage = false;
    if (inputMessages.some(keyword => normalizedTextUser.includes(keyword)) ||
        synonyms.some(synonym => inputMessages.includes(synonym.toLowerCase()) )
    ) {
        var model = whatsappModel.MessageText(targetMessage, number);
        models.push(model);
        addedMessage = true;
        if (doc.messageType === "image") {
            var modelImage = whatsappModel.MessageImage(doc.link, number);
            models.push(modelImage);
            addedMessage = true;
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
