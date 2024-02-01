import { Client, LocalAuth } from "whatsapp-web.js";

import fs from "fs";
import qrcode from "qrcode-terminal";

const SESSION_FILE_PATH = './session.json';
let sessionCfg: any;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}

export const start = async () => {    
    const client = new Client({
        puppeteer: { headless: false, args: ['--no-sandbox'] }, // Make headless true or remove to run browser in background
        session: sessionCfg,
        authStrategy: new LocalAuth()
      });

    client.on('qr', (qr: any) => {
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('READY');

      });

    await client.initialize();

    return client;
}

export const sendMessage = (contact: string, msg: string, client: any) => {
    return client.sendMessage(contact, msg);
}