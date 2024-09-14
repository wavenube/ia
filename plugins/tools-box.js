import fs from 'fs';
const dbFile = './boxStorage.json'; // Archivo JSON donde se guardarán los datos

// Verificar si el archivo de almacenamiento existe, si no, crearlo
if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, JSON.stringify({}));
}

const handler = async (m, { text, quoted, conn }) => {
  if (!text) return conn.reply(m.chat, 'Por favor, proporciona una contraseña para tu caja fuerte.', m);
  if (!quoted) return conn.reply(m.chat, 'Debes responder a un archivo o mensaje multimedia para guardarlo.', m);

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

  // Log para ver qué tipo de mensaje está llegando
  console.log('Mensaje citado (quoted):', quoted);

  let content = null;
  let type = null;

  // Si es una imagen
  if (quoted.message.imageMessage) {
    console.log('Es una imagen.');
    content = await conn.downloadMediaMessage(quoted); // Descargar imagen
    type = 'image';
  }

  // Si es un video
  if (quoted.message.videoMessage) {
    console.log('Es un video.');
    content = await conn.downloadMediaMessage(quoted); // Descargar video
    type = 'video';
  }

  // Si es un documento
  if (quoted.message.documentMessage) {
    console.log('Es un documento.');
    content = await conn.downloadMediaMessage(quoted); // Descargar documento
    type = 'document';
  }

  // Si no se detecta ningún tipo multimedia
  if (!content) {
    return conn.reply(m.chat, 'El archivo que intentas guardar no es una imagen, video o documento válido. Intenta nuevamente.', m);
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
