require("dotenv/config");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken);

sendMessage = (number, password) => {
  client.messages
    .create({
      body: `You password for YourHealth app is : ${password}`,
      from: "+12015817331",
      to: `${number}`,
    })
    .then((message) => console.log(message.sid));
};

module.exports = sendMessage;
