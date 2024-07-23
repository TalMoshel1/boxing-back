import dotenv from 'dotenv';

dotenv.config();

import twilio from 'twilio';

const accountSid = process.env.Account_SID
const authToken = process.env.Auth_Token

const client = twilio(accountSid, authToken)

export function sendWhatsApp(body, to) { 
    client.messages
    .create({
        body: body,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:+972${to}`
    })
    .then(message => console.log(message.sid))
    .done();
}

