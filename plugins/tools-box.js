import fs from 'fs';
const dbFile = './boxStorage.json'; // Archivo JSON donde se guardarán los datos

// Verificar si el archivo de almacenamiento existe, si no, crearlo
if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, JSON.stringify({}));
}

const handler = async (m, { text, quoted, conn, mime }) => {
  if (!text) return conn.reply(m.chat, 'Por favor, proporciona una contraseña para tu caja fuerte.', m);
  if (!quoted || !quoted.message) return conn.reply(m.chat, 'Debes responder a un archivo o mensaje para guardarlo.', m);

  const user = m.sender; // Número del usuario
  const password = text.trim(); // Contraseña proporcionada

  // Leer la base de datos de usuarios
  let boxStorage = JSON.parse(fs.readFileSync(dbFile));

  // Verificar si el usuario ya tiene una entrada
  if (!boxStorage[user]) {
    boxStorage[user] = {
      password: password,
      contents: [] // Donde se guardarán los mensajes/archivos
    };
  }

  // Verificar si la contraseña es correcta
  if (boxStorage[user].password !== password) {
    return conn.reply(m.chat, 'Contraseña incorrecta. No puedes guardar en esta caja fuerte.', m);
  }

  // Verificar si es un archivo de imagen, video o documento
  let content = null;
  let type = null;
  if (mime.startsWith('image/')) {
    content = await conn.downloadMediaMessage(quoted); // Descargar imagen
    type = 'image';
  } else if (mime.startsWith('video/')) {
    content = await conn.downloadMediaMessage(quoted); // Descargar video
    type = 'video';
  } else if (mime.startsWith('application/')) {
    content = await conn.downloadMediaMessage(quoted); // Descargar documento
    type = 'document';
  } else {
    return conn.reply(m.chat, 'El archivo no es soportado. Solo se permiten imágenes, videos y documentos.', m);
  }

  // Guardar el archivo en la caja fuerte del usuario
  boxStorage[user].contents.push({
    type: type,
    content: content // El archivo descargado (imagen, video, documento)
  });

  // Guardar la información actualizada en el archivo JSON
  fs.writeFileSync(dbFile, JSON.stringify(boxStorage, null, 2));

  conn.reply(m.chat, 'Archivo guardado correctamente en tu caja fuerte.', m);
};

handler.command = /^(box)$/i;
export default handler;
