import { createHash } from 'crypto';
import PhoneNumber from 'awesome-phonenumber';
import axios from 'axios';

const handler = async (m, { conn, usedPrefix, participants, isPrems }) => {
  // Identificar al usuario mencionado o al emisor del mensaje
  const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
  
  // Verificar que el usuario esté registrado en la base de datos
  if (!(who in global.db.data.users)) {
    throw 'El usuario no está registrado.';
  }

  try {
    // Obtener la imagen de perfil del usuario
    let pp = await conn.profilePictureUrl(who);
    
    // En caso de error al obtener la foto de perfil, usar una imagen por defecto
    if (!pp) {
      pp = 'https://telegra.ph/file/66c5ede2293ccf9e53efa.jpg'; // Imagen por defecto
    }

    // Obtener datos del usuario desde la base de datos
    const { name, limit, registered, age, premiumTime } = global.db.data.users[who];
    const username = conn.getName(who);
    const sn = createHash('md5').update(who).digest('hex');
    
    // Construir la URL de la API
    const apiUrl = `https://deliriusapi-official.vercel.app/canvas/balcard?url=${encodeURIComponent(pp)}&background=https://telegra.ph/file/66c5ede2293ccf9e53efa.jpg&username=${encodeURIComponent(username)}&discriminator=${sn}&money=${limit}&xp=1000&level=10`;

    // Obtener la imagen de la API
    let response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    
    // Convertir la respuesta en un buffer
    let buffer = Buffer.from(response.data, 'binary');

    // Enviar la imagen generada al chat
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
