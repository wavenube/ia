import axios from 'axios';

let handler = async (m, { conn }) => {
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

    // Envía la imagen generada al chat
    await conn.sendMessage(m.chat, { image: buffer, caption: 'Aquí está tu foto de perfil generada.' }, { quoted: m });
  } catch (e) {
    // Maneja el error si la solicitud falla
    m.reply(`Ocurrió un error al generar la imagen. Detalles: ${e.message}`);
  }
}

handler.help = ['foto'];
handler.tags = ['profile'];
handler.command = ['foto'];

export default handler;
