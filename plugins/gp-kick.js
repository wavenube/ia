import axios from 'axios';

let handler = async (m, { conn, participants, usedPrefix, command }) => {
  let kickte = `🛸 Correct use of the command\n*${usedPrefix + command}* @tag`;

  // Verifica si el comando tiene un usuario mencionado o una respuesta a un mensaje
  if (!m.mentionedJid[0] && !m.quoted) return m.reply(kickte, m.chat, { mentions: conn.parseMention(kickte) });
  
  // Obtiene el usuario a expulsar
  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;

  // Obtén la foto de perfil del usuario que se quiere expulsar
  let userProfilePicture;
  try {
    userProfilePicture = await conn.profilePictureUrl(user, 'image');
  } catch (e) {
    // Si no tiene foto de perfil, usa una imagen por defecto
    userProfilePicture = 'https://telegra.ph/file/66c5ede2293ccf9e53efa.jpg'; // Imagen por defecto si no tiene foto
  }

  // Genera la URL para la API de "delete"
  let apiUrl = `https://deliriusapi-official.vercel.app/canvas/delete?url=${encodeURIComponent(userProfilePicture)}`;

  try {
    // Enviar la solicitud a la API
    let response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    
    // Convierte la respuesta en un buffer
    let buffer = Buffer.from(response.data, 'binary');

    // Envía la imagen generada al chat
    await conn.sendMessage(m.chat, { image: buffer, caption: `Eliminando usuario...` }, { quoted: m });

    // Expulsa al usuario después de enviar la imagen
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
    m.reply(`✅ Usuario expulsado...`);

  } catch (error) {
    console.error(error);
    m.reply('Ocurrió un error al generar la imagen o expulsar al usuario.');
  }
};

handler.help = ['kick @user'];
handler.tags = ['group'];
handler.command = ['kick'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
