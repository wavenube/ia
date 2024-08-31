import { downloadContentFromMessage } from 'baileys';

const handler = async (m, { conn }) => {
  try {
    // Verificar si el mensaje citado está presente
    if (!m.quoted) throw 'Por favor, cita un mensaje de vista única.';

    // Verificar si el mensaje citado es de tipo "viewOnceMessageV2"
    if (m.quoted.mtype !== 'viewOnceMessageV2') throw 'El mensaje citado no es un mensaje de vista única.';

    const msg = m.quoted.message;
    const type = Object.keys(msg)[0];
    const media = await downloadContentFromMessage(msg[type], type === 'imageMessage' ? 'image' : 'video');
    let buffer = Buffer.from([]);

    // Concatenar los chunks del contenido
    for await (const chunk of media) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    // Enviar el archivo según el tipo de mensaje
    if (/video/.test(type)) {
      return conn.sendFile(m.chat, buffer, 'view_once_video.mp4', msg[type].caption || '', m);
    } else if (/image/.test(type)) {
      return conn.sendFile(m.chat, buffer, 'view_once_image.jpg', msg[type].caption || '', m);
    }
  } catch (error) {
    throw `Hubo un error al procesar el mensaje: ${error}`;
  }
};

// Definir ayuda y etiquetas del comando
handler.help = ['readvo'];
handler.tags = ['tools'];

// Definir el comando y el patrón de regex
handler.command = /^(readviewonce|read|revelar|readvo)$/i;

export default handler;
