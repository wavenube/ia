import { createHash } from 'crypto';
import PhoneNumber from 'awesome-phonenumber';
import axios from 'axios';

const handler = async (m, { conn, usedPrefix, participants, isPrems }) => {
  // Configuración de la imagen de perfil por defecto
  let pp = 'https://telegra.ph/file/66c5ede2293ccf9e53efa.jpg';
  
  // Identificar al usuario mencionado o al emisor del mensaje
  const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
  
  // Verificar que el usuario esté registrado en la base de datos
  if (!(who in global.db.data.users)) {
    throw 'El usuario no está registrado.';
  }

  try {
    // Obtener la imagen de perfil del usuario
    pp = await conn.profilePictureUrl(who);
  } catch (e) {
    // En caso de error, se mantiene la imagen por defecto
    pp = 'https://telegra.ph/file/66c5ede2293ccf9e53efa.jpg'; // Imagen por defecto
  }

  // Obtener datos del usuario desde la base de datos
  const { name, limit, registered, age, premiumTime } = global.db.data.users[who];
  const username = conn.getName(who);
  const sn = createHash('md5').update(who).digest('hex');
  
  // Genera la URL para la API de "balcard" con los datos del usuario
  const apiUrl = `https://deliriusapi-official.vercel.app/canvas/balcard?url=${encodeURIComponent(pp)}&background=https://telegra.ph/file/66c5ede2293ccf9e53efa.jpg&username=${encodeURIComponent(username)}&discriminator=${sn}&money=${limit}&xp=1000&level=10`;

  try {
    // Enviar la solicitud a la API
    let response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    
    // Convierte la respuesta en un buffer
    let buffer = Buffer.from(response.data, 'binary');

    // Envía la imagen generada al chat con el perfil del usuario
    await conn.sendMessage(m.chat, { image: buffer, caption: `Perfil de ${username}` }, { quoted: m });

  } catch (error) {
    console.error(error);
    m.reply('Ocurrió un error al generar la tarjeta de perfil.');
  }
};

handler.help = ['profile [@user]'];
handler.tags = ['xp'];
handler.command = /^perfil|profile?$/i;

export default handler;
