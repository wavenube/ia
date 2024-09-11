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

    // Envía la imagen generada al chat con un mensaje de confirmación
    await conn.sendMessage(m.chat, { image: buffer, caption: `¿Expulsar a este usuario? Responde con *sí* o *no*` }, { quoted: m });

    // Espera la respuesta del administrador para confirmar la expulsión
    conn.on('chat-update', async (update) => {
      if (update && update.messages && update.count) {
        let reply = update.messages.all()[0];
        if (reply.key.remoteJid === m.chat && reply.message.conversation) {
          if (reply.message.conversation.toLowerCase() === 'sí' || reply.message.conversation.toLowerCase() === 'si') {
            // Expulsa al usuario si la respuesta es "sí"
            await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
            await conn.reply(m.chat, `✅ Usuario expulsado...`, m);
          } else if (reply.message.conversation.toLowerCase() === 'no') {
            // Cancela la expulsión si la respuesta es "no"
            await conn.reply(m.chat, `❌ Expulsión cancelada.`, m);
          }
        }
      }
    });

  } catch (error) {
    console.error(error);
    m.reply('Hubo un error al generar la imagen de expulsión. Inténtalo de nuevo más tarde.');
  }
};

handler.help = ['kick @user'];
handler.tags = ['group'];
handler.command = ['kick']; 
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
