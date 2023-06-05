const nodemailer = require('nodemailer')
const {google} = require ('googleapis')
const axios = require("axios");

const CLIENT_ID='714964605525-v5pmhjc84usbtp57bg254rt84bks8mvr.apps.googleusercontent.com'
const CLIENT_SECRET='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'
const REDIRECT_URI='https://developers.google.com/oauthplayground'
const REFRESH_TOKEN='1//04Lf1FX6deYHoCgYIARAAGAQSNwF-L9IrV3SjCz_B75JeMwtOilWQ-dxwZiA7vz47DOuDXGoWCA_3rtW10fS_gnukuYG1iVsskm4'

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  
async function sendMail() {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: 'pabloperedo04@gmail.com',
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,
          },
        });
    
        const mailOptions = {
          from: 'Pablo Rivas <pabloperedo04@gmail.com>',
          to: 'pabloperedo04@gmail.com',
          subject: 'Hello from gmail using API',
          text: 'Hello from gmail email using API',
          html: '<h1>Hello from gmail email using API</h1>',
        };
    
        const result = await transport.sendMail(mailOptions);
        console.log(result)
        return result;
      } catch (error) {
        return error;
      }
}
const generateConfig = (url, accessToken) => {
    return {
      method: "get",
      url: url,
      headers: {
        Authorization: `Bearer ${accessToken} `,
        "Content-type": "application/json",
      },
    };
  };
async function getUser(req, res) {
    try {
        const url = `https://gmail.googleapis.com/gmail/v1/users/pabloperedo04@gmail.com/profile`;
        const { token } = await oAuth2Client.getAccessToken();
        const config = generateConfig(url, token);
        const response = await axios(config);
        res.json(response.data);
      } catch (error) {
        console.log(error);
        res.send(error);
      }
}

async function getDrafts(req, res) {
    try {
        const url = `https://gmail.googleapis.com/gmail/v1/users/pabloperedo04@gmail.com/messages?maxResults=`+10;
        const { token } = await oAuth2Client.getAccessToken();
        const config = generateConfig(url, token);
        const response = await axios(config);
        const messages = response.data.messages;
        const fullMessages = await Promise.all(
            messages.map(async (message) => {
              const messageId = message.id;
              const messageUrl = `https://gmail.googleapis.com/gmail/v1/users/pabloperedo04@gmail.com/messages/${messageId}`;
              const messageConfig = {
                method: 'GET',
                url: messageUrl,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              };
              const messageResponse = await axios(messageConfig);
              messageData={
                  id: messageResponse.id,
                  msg:messageResponse.snippet
              }
              let result = []
              Array.from(messageResponse.data.payload.headers).forEach((message) =>{
                if(message.name == "Date"|| message.name =="Subject"|| message.name == "From"){
                    result.push({ name: message.name, value: message.value })
                }
              });
              return result;
            })
          );
        res.json(fullMessages);
      } catch (error) {
        console.log(error);
        res.send(error);
      }
}

async function getMessagesById(req, res) {
   
}

module.exports = {
  getUser,
  sendMail,
  getDrafts,
  getMessagesById,
};