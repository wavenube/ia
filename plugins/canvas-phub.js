import axios from 'axios';

let handler = async (m, { conn, text }) => {
  // Verifica que el usuario haya ingresado el texto
  if (!text) return m.reply('Por favor, ingrese el texto que desea usar. Ejemplo: .phub Bienvenido a Delirius API 😈');

  // Obtén el nombre del usuario que ejecuta el comando
  let username = await conn.getName(m.sender);

  // Obtén la foto de perfil del usuario
  let userProfilePicture;
  try {
    userProfilePicture = await conn.profilePictureUrl(m.sender, 'image'); // Obtén la foto de perfil del usuario
  } catch (e) {
    // Si no tiene foto de perfil, usa una imagen por defecto
    userProfilePicture = 'https://telegra.ph/file/66c5ede2293ccf9e53efa.jpg'; // Imagen por defecto si no tiene foto de perfil
  }

  // Genera la URL con los parámetros
  let apiUrl = `https://deliriusapi-official.vercel.app/canvas/phub?image=${encodeURIComponent(userProfilePicture)}&username=${encodeURIComponent(username)}&text=${encodeURIComponent(text)}`;

  try {
    // Enviar la solicitud a la API
    let response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    
    // Convierte la respuesta en un buffer
    let buffer = Buffer.from(response.data, 'binary');

    // Envía la imagen generada al chat
    await conn.sendMessage(m.chat, { image: buffer, caption: `Imagen generada para ${username}` }, { quoted: m });

  } catch (error) {
    console.error(error);
    m.reply('Hubo un error al generar la imagen. Inténtalo de nuevo más tarde.');
  }
};

handler.command = /^phub$/i; // El comando será activado con ".phub"
export default handler;
