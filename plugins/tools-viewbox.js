import fs from 'fs';
const dbFile = './boxStorage.json'; // Archivo JSON donde se guardarán los datos

const handler = async (m, { text, conn }) => {
  if (!text) return conn.reply(m.chat, 'Por favor, proporciona tu contraseña para ver tu caja fuerte.', m);

  const user = m.sender; // Número del usuario
  const password = text.trim(); // Contraseña proporcionada

  // Leer la base de datos de usuarios
  let boxStorage = JSON.parse(fs.readFileSync(dbFile));

  // Verificar si el usuario existe en la base de datos
  if (!boxStorage[user]) {
    return conn.reply(m.chat, 'No tienes una caja fuerte registrada.', m);
  }

  // Verificar si la contraseña es correcta
  if (boxStorage[user].password !== password) {
    return conn.reply(m.chat, 'Contraseña incorrecta. No puedes acceder a esta caja fuerte.', m);
  }

  // Obtener los archivos guardados del usuario
  const userContents = boxStorage[user].contents;

  if (userContents.length === 0) {
    return conn.reply(m.chat, 'Tu caja fuerte está vacía.', m);
  }

  // Enviar todos los archivos guardados al usuario
  for (let item of userContents) {
    if (item.type === 'imageMessage') {
      await conn.sendMessage(m.chat, { image: { url: item.content.url }, caption: 'Imagen guardada en tu caja fuerte.' });
    } else if (item.type === 'videoMessage') {
      await conn.sendMessage(m.chat, { video: { url: item.content.url }, caption: 'Video guardado en tu caja fuerte.' });
    } else if (item.type === 'documentMessage') {
      await conn.sendMessage(m.chat, { document: { url: item.content.url }, caption: 'Documento guardado en tu caja fuerte.' });
    } else {
      await conn.sendMessage(m.chat, { text: 'Contenido guardado: ' + item.content.conversation });
    }
  }
};

handler.command = /^(viewbox)$/i;
export default handler;
