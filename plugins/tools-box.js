import fs from 'fs';
const dbFile = './boxStorage.json'; // Archivo JSON donde se guardarán los datos

// Verificar si el archivo de almacenamiento existe, si no, crearlo
if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, JSON.stringify({}));
}

const handler = async (m, { text, quoted, conn }) => {
  if (!text) return conn.reply(m.chat, 'Por favor, proporciona una contraseña para tu caja fuerte.', m);
  if (!quoted) return conn.reply(m.chat, 'Debes responder a un archivo o mensaje para guardarlo.', m);

  const user = m.sender; // Número del usuario
  const password = text.trim(); // Contraseña proporcionada
  const message = quoted.message; // El mensaje que se está guardando (archivo, imagen, video, etc.)

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

  // Guardar el mensaje en la caja fuerte del usuario
  boxStorage[user].contents.push({
    type: Object.keys(message)[0], // Tipo de archivo (ej. imageMessage, videoMessage, etc.)
    content: message[Object.keys(message)[0]] // El contenido del archivo o mensaje
  });

  // Guardar la información actualizada en el archivo JSON
  fs.writeFileSync(dbFile, JSON.stringify(boxStorage, null, 2));

  conn.reply(m.chat, 'Archivo guardado correctamente en tu caja fuerte.', m);
};

handler.command = /^(box)$/i;
export default handler;
