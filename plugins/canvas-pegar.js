import axios from 'axios';

let handler = async (m, { conn, participants, usedPrefix, command }) => {
  let slapte = `🛸 Correct use of the command\n*${usedPrefix + command}* @tag`;

  // Verifica si el comando tiene un usuario mencionado o una respuesta a un mensaje
  if (!m.mentionedJid[0] && !m.quoted) return m.reply(slapte, m.chat, { mentions: conn.parseMention(slapte) });
  
  // Obtiene el usuario que envía el comando y el usuario que fue mencionado
  let user1 = m.sender; // El solicitante
  let user2 = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender; // El usuario mencionado o citado

  // Obtén las fotos de perfil del solicitante (user1) y del usuario etiquetado (user2)
  let user1ProfilePicture, user2ProfilePicture;
  try {
    user1ProfilePicture = await conn.profilePictureUrl(user1, 'image');
  } catch (e) {
    // Si no tiene foto de perfil, usa una imagen por defecto
    user1ProfilePicture = 'https://telegra.ph/file/66c5ede2293ccf9e53efa.jpg'; // Imagen por defecto si no tiene foto
  }

  try {
    user2ProfilePicture = await conn.profilePictureUrl(user2, 'image');
  } catch (e) {
    // Si no tiene foto de perfil, usa una imagen por defecto
    user2ProfilePicture = 'https://i.postimg.cc/4dtK95CG/b1f2f1fce38c8d252ad01ba97fa60e17.jpg'; // Imagen por defecto si no tiene foto
  }

  // Genera la URL para la API de "bofetada"
  let apiUrl = `https://deliriusapi-official.vercel.app/canvas/bofetada?url1=${encodeURIComponent(user1ProfilePicture)}&url2=${encodeURIComponent(user2ProfilePicture)}`;

  try {
    // Enviar la solicitud a la API
    let response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    
    // Convierte la respuesta en un buffer
    let buffer = Buffer.from(response.data, 'binary');

    // Envía la imagen generada al chat
    await conn.sendMessage(m.chat, { image: buffer, caption: `💥 ${await conn.getName(user1)} le dio una bofetada a ${await conn.getName(user2)}!` }, { quoted: m });

  } catch (error) {
    console.error(error);
    m.reply('Ocurrió un error al generar la imagen de la bofetada.');
  }
};

handler.help = ['pegar @user'];
handler.tags = ['fun'];
handler.command = ['pegar'];
handler.admin = false;
handler.group = true;

export default handler;
