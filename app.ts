import { Client, LocalAuth } from "whatsapp-web.js";

import fs from "fs";
import qrcode from "qrcode";

const SESSION_FILE_PATH = './session.json';
let sessionCfg: any;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}

function generateAndSaveQR(qrData: any, filePath: any) {
  qrcode.toFile(filePath, qrData, {
      color: {
          dark: '#000',  // Puntos QR
          light: '#FFF' // Fondo
      }
  }, function (err) {
      if (err) throw err;
      console.log('QR Code saved to', filePath);
  });
}

export const start = async () => {    
    const client = new Client({
        session: sessionCfg,
        authStrategy: new LocalAuth()
      });

    client.on('qr', (qr: any) => {
      generateAndSaveQR(qr, './public/qr.png');
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