import axios from 'axios';
import PhoneNumber from 'awesome-phonenumber';
import { createHash } from 'crypto';

const handler = async (m, { conn, usedPrefix, participants, isPrems }) => {
  // Identificar al usuario mencionado o al emisor del mensaje
  const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;

  // Verificar que el usuario esté registrado en la base de datos
  if (!(who in global.db.data.users)) {
    throw 'El usuario no está registrado.';
  }

  // Obtener datos del usuario desde la base de datos
  const { name, limit, registered, age, premiumTime } = global.db.data.users[who];
  const username = conn.getName(who);
  const sn = createHash('md5').update(who).digest('hex');

  // Generar la URL para la API de perfil
  const apiUrl = `https://deliriusapi-official.vercel.app/canvas/balcard?url=${encodeURIComponent(await conn.profilePictureUrl(who, 'image'))}&background=https://telegra.ph/file/66c5ede2293ccf9e53efa.jpg&username=${encodeURIComponent(username)}&discriminator=${sn}&money=0&xp=0&level=0`;

  try {
    // Enviar la solicitud a la API
    let response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    
    // Convierte la respuesta en un buffer
    let buffer = Buffer.from(response.data, 'binary');

    // Construir el texto del perfil
    const str = `Nombre: ${username} ${registered ? '(' + name + ') ': ''}
Número: ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
Enlace: wa.me/${who.split('@')[0]}${registered ? ' Edad: ' + age : ''}
Límites: ${limit}
Registro: ${registered ? 'Registrado' : 'No registrado'}
Premium: ${premiumTime > 0 ? 'Sí' : 'No premium'}`;

    // Enviar la imagen generada con el texto del perfil
    await conn.sendMessage(m.chat, { image: buffer, caption: str }, { quoted: m });
  } catch (e) {
    console.error('Error al generar la tarjeta de perfil:', e);
    m.reply('Ocurrió un error al generar la tarjeta de perfil. Por favor, inténtalo de nuevo más tarde.');
  }
};

handler.help = ['perfil [@user]'];
handler.tags = ['xp'];
handler.command = /^perfil|profile?$/i;

export default handler;
