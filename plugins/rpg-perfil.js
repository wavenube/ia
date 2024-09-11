import { createHash } from 'crypto';
import PhoneNumber from 'awesome-phonenumber';
import axios from 'axios';

const handler = async (m, { conn, usedPrefix, participants, isPrems }) => {
  // Configuración de la imagen de perfil por defecto
  let pp = 'https://telegra.ph/file/06cc652844ea19e8aed1c.jpg';
  
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
  const prem = global.prems.includes(who.split('@')[0]);
  const sn = createHash('md5').update(who).digest('hex');
  
  // Genera la URL para la API de "balcard"
  const apiUrl = `https://deliriusapi-official.vercel.app/canvas/balcard?url=${encodeURIComponent(pp)}&background=https://telegra.ph/file/66c5ede2293ccf9e53efa.jpg&username=${encodeURIComponent(username)}&discriminator=${sn}&money=${limit}&xp=0&level=1`;

  try {
    // Enviar la solicitud a la API
    let response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    
    // Convierte la respuesta en un buffer
    let buffer = Buffer.from(response.data, 'binary');

    // Construir la cadena de perfil
    const str = `Nombre: ${username} ${registered ? '(' + name + ') ' : ''}
Número: ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
Enlace: wa.me/${who.split('@')[0]}${registered ? ' Edad: ' + age : ''}
Límites: ${limit}
Registro: ${registered ? 'Registrado' : 'No registrado'}
Premium: ${premiumTime > 0 ? 'Sí' : (isPrems ? 'Premium' : 'No premium')}
Hash: ${sn}`;

    // Envía la imagen generada al chat
    await conn.sendMessage(m.chat, { image: buffer, caption: str }, { quoted: m });

  } catch (error) {
    console.error(error);
    m.reply('Ocurrió un error al generar la tarjeta de perfil.');
  }
};

handler.help = ['profile [@user]'];
handler.tags = ['xp'];
handler.command = /^perfil|profile?$/i;

export default handler;
