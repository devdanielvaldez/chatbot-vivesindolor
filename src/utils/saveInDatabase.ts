import fs from 'fs';
import path from 'path';

const databasePath: string = path.join(__dirname, 'solicitudes.json');

export const saveToDatabase = (solicitudes: any): void => {
    fs.writeFileSync(databasePath, JSON.stringify(solicitudes, null, 2), 'utf-8');
};

export const readDatabase = (): any => {
    if (fs.existsSync(databasePath)) {
      const data: string = fs.readFileSync(databasePath, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  };
