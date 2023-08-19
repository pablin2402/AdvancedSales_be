const whatsappModel = require("../shared/whatsappmodels");
const whatsappService = require("../services/whatsappService");
const TextProcess = require("../models/TextProcess");

const OPENAI_API_KEY = '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';

async function getSynonyms(word) {
    const response = await axios.post(
        'https://api.openai.com/v1/engines/davinci-codex/completions',
        {
            prompt: `Get synonyms for "${word}"`,
            max_tokens: 50,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        }
    );
    const synonyms = response.data.choices.map(choice => choice.text.trim());
    console.log("laskjhgfc"+synonyms)
    return synonyms;
}

const getListOfTextProcess = async (idClient) => {
    return await TextProcess.find({ idClient: idClient });
};

async function Process(textUser, number){
    var models = [];

    try {
        const dbData = await getListOfTextProcess("CL-01");
        dbData.forEach(doc => {
            const inputMessages = doc.inputMessage.map(keyword => keyword.toLowerCase()); 
            const targetMessage = doc.targetMessage; 

            processDocument(doc, textUser, number, models, dbData, inputMessages, targetMessage);
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

async function processDocument(doc, textUser, number, models, dbData, inputMessages, targetMessage) {
    if (inputMessages.some(keyword => textUser.toLowerCase().includes(keyword))) {
        var model = whatsappModel.MessageText(targetMessage, number);
        models.push(model);
        if (doc.messageType === "image") {
            var modelImage = whatsappModel.MessageImage(doc.link, number);
            models.push(modelImage);
        }
    }

    const synonymsPromises = inputMessages.map(async keyword => {
        const synonyms = await getSynonyms(keyword);
        return synonyms;
    });
    console.log("0987654"+synonymsPromises)
    
    const synonymsArrays = await Promise.all(synonymsPromises);
    const flatSynonyms = synonymsArrays.flat();

    if (flatSynonyms.some(synonym => textUser.toLowerCase().includes(synonym))) {
        var model = whatsappModel.MessageText(targetMessage, number);
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
