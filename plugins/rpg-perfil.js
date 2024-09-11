import axios from 'axios';
import { createHash } from 'crypto';
import PhoneNumber from 'awesome-phonenumber';

const handler = async (m, { conn, usedPrefix }) => {
  // Identificar al usuario mencionado o al emisor del mensaje
  const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;

  // Verificar que el usuario esté registrado en la base de datos
  if (!(who in global.db.data.users)) {
    return m.reply('El usuario no está registrado.');
  }

  try {
    // Obtener la imagen de perfil del usuario
    let userProfilePicture;
    try {
      userProfilePicture = await conn.profilePictureUrl(who, 'image');
    } catch (e) {
      // Si no tiene foto de perfil, usa una imagen por defecto
      userProfilePicture = 'https://telegra.ph/file/66c5ede2293ccf9e53efa.jpg'; // Imagen por defecto si no tiene foto
    }

    // Obtener datos del usuario desde la base de datos
    const { name, limit, registered, age, premiumTime } = global.db.data.users[who];
    const username = conn.getName(who);
    const sn = createHash('md5').update(who).digest('hex');

    // Construir la URL de la API
    const apiUrl = `https://deliriusapi-official.vercel.app/canvas/balcard?url=${encodeURIComponent(userProfilePicture)}&background=https://telegra.ph/file/66c5ede2293ccf9e53efa.jpg&username=${encodeURIComponent(username)}&discriminator=${sn}&money=${limit}&xp=1000&level=10`;

    // Obtener la imagen de la API
    let response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

    // Verifica si la respuesta es válida
    if (response.status !== 200) {
      throw new Error(`Error al obtener la imagen: ${response.statusText}`);
    }
    
    // Convertir la respuesta en un buffer
    let buffer = Buffer.from(response.data, 'binary');

    // Enviar la imagen generada al chat
    await conn.sendMessage(m.chat, { image: buffer, caption: `Perfil de ${username}` }, { quoted: m });

  } catch (error) {
    console.error('Error al generar la imagen de perfil:', error);
    m.reply(`Ocurrió un error al generar la tarjeta de perfil. Detalles: ${error.message}`);
  }
};

handler.help = ['profile [@user]'];
handler.tags = ['xp'];
handler.command = /^perfil|profile?$/i;

export default handler;
