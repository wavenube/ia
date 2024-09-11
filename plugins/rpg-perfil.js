import axios from 'axios';
import { createHash } from 'crypto';
import PhoneNumber from 'awesome-phonenumber';

const handler = async (m, { conn }) => {
  // Obtén el perfil de imagen del usuario
  let userProfilePicture;
  try {
    userProfilePicture = await conn.profilePictureUrl(m.sender, 'image');
  } catch (e) {
    // Usa una imagen por defecto si no hay foto de perfil
    userProfilePicture = 'https://telegra.ph/file/66c5ede2293ccf9e53efa.jpg'; // Imagen por defecto
  }

  // Construye la URL para la API
  let apiUrl = `https://deliriusapi-official.vercel.app/canvas/balcard?url=${encodeURIComponent(userProfilePicture)}&background=https://telegra.ph/file/66c5ede2293ccf9e53efa.jpg&username=${encodeURIComponent(conn.getName(m.sender))}&discriminator=1231311313214&money=0&xp=0&level=0`;

  try {
    // Enviar la solicitud a la API
    let response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

    // Convierte la respuesta en un buffer
    let buffer = Buffer.from(response.data, 'binary');

    // Obtener datos del usuario desde la base de datos
    const { name, limit, registered, age, premiumTime } = global.db.data.users[m.sender];
    const username = conn.getName(m.sender);
    const sn = createHash('md5').update(m.sender).digest('hex');

    // Construir la cadena de perfil
    const str = `Nombre: ${username} ${registered ? '(' + name + ') ': ''}
Número: ${PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', '')).getNumber('international')}
Enlace: wa.me/${m.sender.split('@')[0]}${registered ? ' Edad: ' + age : ''}
Límites: ${limit}
Registro: ${registered ? 'Registrado' : 'No registrado'}
Premium: ${premiumTime > 0 ? 'Sí' : 'No premium'}
Hash: ${sn}`;

    // Envía la imagen generada al chat con el texto informativo
    await conn.sendMessage(m.chat, { image: buffer, caption: str }, { quoted: m });
  } catch (e) {
    // Maneja el error si la solicitud falla
    m.reply(`Ocurrió un error al generar la imagen. Detalles: ${e.message}`);
  }
}

handler.help = ['perfil [@user]'];
handler.tags = ['xp'];
handler.command = /^perfil|profile?$/i;

export default handler;
