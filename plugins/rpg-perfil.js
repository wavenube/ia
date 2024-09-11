import axios from 'axios';
import { createHash } from 'crypto';
import PhoneNumber from 'awesome-phonenumber';

// Comando para generar la imagen de perfil
const handler = async (m, { conn, usedPrefix }) => {
  // Identificar al usuario mencionado o al emisor del mensaje
  const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;

  // Verificar que el usuario esté registrado en la base de datos
  if (!(who in global.db.data.users)) {
    throw 'El usuario no está registrado.';
  }

  // Datos de la API
  const { name, limit, registered, age, premiumTime } = global.db.data.users[who];
  const username = conn.getName(who);
  const sn = createHash('md5').update(who).digest('hex');

  // Construye la URL para la API con los datos del usuario
  const apiUrl = `https://deliriusapi-official.vercel.app/canvas/balcard?url=https://i.postimg.cc/NMmRr1mT/asasa.jpg&background=https://telegra.ph/file/66c5ede2293ccf9e53efa.jpg&username=${encodeURIComponent(username)}&discriminator=${encodeURIComponent(sn)}&money=0&xp=0&level=0`;

  try {
    // Enviar la solicitud a la API
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

    // Convierte la respuesta en un buffer
    const buffer = Buffer.from(response.data, 'binary');

    // Construir la cadena de perfil
    const str = `Nombre: ${username} ${registered ? '(' + name + ') ': ''}
Número: ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
Enlace: wa.me/${who.split('@')[0]}${registered ? ' Edad: ' + age : ''}
Límites: ${limit}
Registro: ${registered ? 'Registrado' : 'No registrado'}
Premium: ${premiumTime > 0 ? 'Sí' : 'No premium'}`;

    // Envía la imagen generada y la cadena de perfil
    await conn.sendMessage(m.chat, { image: buffer, caption: str }, { quoted: m });
  } catch (e) {
    // Maneja el error si la solicitud falla
    m.reply(`Ocurrió un error al generar la imagen de perfil. Detalles: ${e.message}`);
  }
};

handler.help = ['profile [@user]'];
handler.tags = ['xp'];
handler.command = /^perfil|profile?$/i;

export default handler;
