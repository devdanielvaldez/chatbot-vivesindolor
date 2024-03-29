import express from "express";
import morgan from "morgan";
import cors from "cors";
import { config } from "dotenv";

import http from 'http';
import { Server } from 'socket.io';

import { engine } from "express-handlebars";
// import { start } from "./app";
import * as venom from "venom-bot";
import { initChat } from "./initChat";
import qrcode from 'qrcode';
import fs from 'fs';
import path from "path";
import { openAIStart } from "./src/utils/openai";


const app = express();
const server = http.createServer(app);
const io = new Server(server);

config();

// Configuración de Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.static('public'));
const QR_CODE_DIR = path.join(__dirname, 'public'); 
const QR_CODE_PATH = path.join(QR_CODE_DIR, 'qr.png');
let img = "";

fs.readFile(QR_CODE_PATH, (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    const base64Image = data.toString('base64');

    img = `data:image/png;base64,${base64Image}`;

});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Función para generar y enviar QR
    const sendQR = async () => {
        try {
            // const qrData = img; // Aquí debes definir los datos del QR
            // const qrImage = await qrcode.toDataURL(qrData);?
            // socket.emit('qr', qrImage); // Enviar el QR al cliente
        } catch (error) {
            console.error('Error generating QR', error);
        }
    };

    // Llamar a la función inicialmente y cada vez que necesites actualizar el QR
    sendQR();

    // Ejemplo de actualización cada 5 segundos (solo como demostración)
    setInterval(sendQR, 5000);

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



venom
    .create({
        session: 'vivesindolor'
    })
    .then((client) => start(client))
    .catch((err) => {
        console.log(err);
    })

const start = (client: any) => {
    client.onMessage(async (message: any) => {
        console.log('test', message.body);
        await openAIStart(`El nombre del cliente es: ${message.sender.name} y envio este mensaje: ${message.body}`)
        .then((data) => {
            client
                .sendText(message.from, data[0].message.content);
        });
        // db.db.collection('potencialClient')
        // .where('ws', '==', message.from)
        // .get()
        // .then(data => {
        //     if(data.empty == true) {
        //         db.potencialClientRef.set({ ws: message.from, name: message.sender.name });
        //     } else {
        //         const estadoClientes = new Map<string, ClienteEstado>();
        //         const from = message.from;
        //         if (!estadoClientes.has(from)) {
        //             estadoClientes.set(from, { etapa: 'inicio', datos: {} });
        //         }
        
        //         if (message.body.toUpperCase() === "QUIERO UN PRESTAMO" || message.body.toUpperCase() === "QUIERO UN PRÉSTAMO") {
        //             db.db.collection('solicitudes')
        //             .where('whatsapp', '==', message.from)
        //             .get()
        //             .then(snapshot => {
        //                 if(snapshot.empty == false) {
        //                     snapshot.forEach(doc => {
        //                         if(doc.data().estado == 'PE' || doc.data().estado == 'AP') return client.sendText(from, `Ya posees un prestamo ${doc.data().estado == 'PE' ? 'En Revisión' : doc.data().estado == 'AP' ? 'Aprobado' : ''}`);
        //                       });
        //                     return;
        //                 } else {
        //                     state = true;
        //                     client.sendText(from, "PARA INICIAR NUESTRO PROCESO REQUERIMOS QUE POSEA SU CÉDULA Y SU CÁMARA DISPONIBLE. Confirme que esta listo enviando 1");
        //                     return;
        //                 }

        //             });
        //             return;
        //         }
        
        //         if (state == true) {
        //             switch (estado.etapa) {
        //                 case 'inicio':
        //                     client.sendText(from, "Por favor, ingrese su Nombre Completo:");
        //                     estado.etapa = 'nombre';
        //                     break;
        //                 case 'nombre':
        //                     estado.datos.apellido = message.body;
        //                     client.sendText(from, "Ingrese el tipo de identificación: 1 para Cédula, 2 para Pasaporte:");
        //                     estado.etapa = 'tipoIdentificacion';
        //                     break;
        //                 case 'tipoIdentificacion':
        //                     if (message.body === '1' || message.body === '2') {
        //                         estado.datos.tipoIdentificacion = message.body === '1' ? 'Cédula' : 'Pasaporte';
        //                         client.sendText(from, `Por favor, ingrese su número de identificación (${message.body == '1' ? 'Cedula' : 'Pasaporte'}):`);
        //                         estado.etapa = 'identificacion';
        //                     } else {
        //                         client.sendText(from, "Entrada no válida. Ingrese 1 para Cédula o 2 para Pasaporte:");
        //                     }
        //                     break;
        //                 case 'identificacion':
        //                     estado.datos.identificacion = message.body;
        //                     client.sendText(from, "Por favor, ingrese su fecha de nacimiento (formato DD/MM/AAAA):");
        //                     estado.etapa = 'fechaNacimiento';
        //                     break;
        //                 case 'fechaNacimiento':
        //                     estado.datos.fechaNacimiento = message.body;
        //                     client.sendText(from, "Ingrese su sexo: 1 para Masculino, 2 para Femenino:");
        //                     estado.etapa = 'sexo';
        //                     break;
        //                 case 'sexo':
        //                     if (message.body === '1' || message.body === '2') {
        //                         estado.datos.sexo = message.body === '1' ? 'Masculino' : 'Femenino';
        //                         client.sendText(from, "Por favor, ingrese su Estado Civil (1. Soltero/a, 2. Casado/a, 3. Divorciado/a, 4. Unión Libre):");
        //                         estado.etapa = 'estadoCivil';
        //                         break;
        //                     } else {
        //                         client.sendText(from, "Entrada no válida. Ingrese 1 para Masculino o 2 para Femenino:");
        //                     }
        //                     break;
        //                 case 'estadoCivil':
        //                     if (message.body === '1' || message.body === '2' || message.body === '3' || message.body === '4') {
        //                         estado.datos.estadoCivil = message.body === '1' ? 'Soltero/a' : message.body === '2' ? 'Casado/a' : message.body === '3' ? 'Divorciado/a' : 'Unión Libre';
        //                         client.sendText(from, "Ingrese su dirección:");
        //                         estado.etapa = 'direccion';
        //                     } else {
        //                         client.sendText(from, "Entrada no válida. Por favor ingrese 1 para Soltero/a, 2 para Casado/a, 3 para Divorciado/a, 4 para Unión Libre:");
        //                     }
        //                     break;
        //                 case 'direccion':
        //                     estado.datos.direccion = message.body;
        //                     client.sendText(from, "Ingrese el número de teléfono móvil:");
        //                     estado.etapa = 'telefonoMovil';
        //                     break;
        //                 case 'telefonoMovil':
        //                     estado.datos.telefonoMovil = message.body;
        //                     client.sendText(from, "Ingrese el Nombre completo del cónyuge (si aplica):");
        //                     estado.etapa = 'nombreConyuge';
        //                     break;
        //                 case 'nombreConyuge':
        //                     estado.datos.nombreConyuge = message.body;
        //                     client.sendText(from, "Ingrese el número de teléfono móvil de su cónyuge (si aplica):");
        //                     estado.etapa = 'telefonoMovilConyuge';
        //                     break;
        //                 case 'telefonoMovilConyuge':
        //                     estado.datos.telefonoMovilConyuge = message.body;
        //                     client.sendText(from, "Ingrese el lugar donde trabaja:");
        //                     estado.etapa = 'lugarTrabajo';
        //                     break;
        //                 case 'lugarTrabajo':
        //                     estado.datos.lugarTrabajo = message.body;
        //                     client.sendText(from, "Ingrese el número de teléfono de su lugar de trabajo:");
        //                     estado.etapa = 'telefonoTrabajo';
        //                     break;
        //                 case 'telefonoTrabajo':
        //                     estado.datos.telefonoTrabajo = message.body;
        //                     client.sendText(from, "Ingrese el Cargo que ocupa en su trabajo:");
        //                     estado.etapa = 'cargoTrabajo';
        //                     break;
        //                 case 'cargoTrabajo':
        //                     estado.datos.cargoTrabajo = message.body;
        //                     client.sendText(from, "¿Cuánto tiempo lleva trabajando en su empleo actual? (Por favor, especifique en meses):");
        //                     estado.etapa = 'tiempoTrabajo';
        //                     break;
        //                 case 'tiempoTrabajo':
        //                     estado.datos.tiempoTrabajo = message.body;
        //                     client.sendText(from, "Ingrese su Ingreso mensual por trabajo:");
        //                     estado.etapa = 'ingresoTrabajo';
        //                     break;
        //                 case 'ingresoTrabajo':
        //                     estado.datos.ingresoTrabajo = message.body;
        //                     client.sendText(from, "Ingrese cualquier otro Ingreso que tenga:");
        //                     estado.etapa = 'otrosIngresos';
        //                     break;
        //                 case 'otrosIngresos':
        //                     estado.datos.otrosIngresos = message.body;
        //                     client.sendText(from, "Ingrese el Monto del préstamo que desea solicitar:");
        //                     estado.etapa = 'montoPrestamo';
        //                     break;
        //                 case 'montoPrestamo':
        //                     estado.datos.montoPrestamo = message.body;
        //                     client.sendText(from, "Ingrese el plazo en el que desea pagar el préstamo (en meses):");
        //                     estado.etapa = 'plazoPrestamo';
        //                     break;
        //                 case 'plazoPrestamo':
        //                     estado.datos.plazoPrestamo = message.body;
        //                     estado.datos.whatsapp = from;
        //                     estado.datos.estado = 'PE';
        //                     client.sendText(from, "Permitanos unos segundos mientras guardamos su información.");
        //                     db.soliditudRef.set(estado.datos)
        //                     .then(() => {
        //                         client.sendText(from, "Hemos recibido su solicitud de forma satisfactoria, en el menor tiempo posible nos estaremos comunicando con usted.");
        //                         estado.etapa = 'completado';
        //                         state = false;
        //                     })
        //                     break;
        //                 case 'completado':
        //                     client.sendText(from, "Si desea obtener otra informacion por favor indiquenos en que mas podemos ayudarle");
        //                     estado.etapa == 'inicio';
        //                     break;
        //                 default:
        //                     client.sendText(from, "No he entendido tu respuesta, por favor comienza de nuevo.");
        //                     estado.etapa = 'inicio';
        //             }
        //         }

        //         if (state == false) {
        //             openAIStart(`El nombre del cliente es: ${message.sender.name} y envio este mensaje: ${message.body}`)
        //                 .then((data) => {
        //                     client
        //                         .sendText(message.from, data[0].message.content);
        //                 });
        //         }
        //     }
        // })
    })
}


