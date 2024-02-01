import * as admin from 'firebase-admin';
import * as serviceAccount from '../../serviceAccount.json';
import { generateUUID } from './uuid';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: 'https://credivia-3b963-default-rtdb.firebaseio.com/'
  });

export const db = admin.firestore();
export const soliditudRef = db.collection('solicitudes').doc(generateUUID());
export const potencialClientRef = db.collection('potencialClient').doc(generateUUID());