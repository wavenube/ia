import axios from 'axios';

let handler = async (m, { conn, text }) => {
  // Verifica que el usuario haya ingresado el texto
  if (!text) return m.reply('Por favor, ingrese un nombre de usuario y un texto. Ejemplo: .phub Sareth|Bienvenido a Delirius API 😈');
  
  // Separa el nombre de usuario del texto usando "|"
  let [username, ...txt] = text.split('|');
  
  if (!username || !txt.length) return m.reply('Por favor, ingrese correctamente el nombre de usuario y el texto, separados por "|"');

  let finalText = txt.join(' ').trim();
  let imageUrl = 'https://telegra.ph/file/66c5ede2293ccf9e53efa.jpg'; // URL de la imagen fija

  // Genera la URL con los parámetros
  let apiUrl = `https://deliriusapi-official.vercel.app/canvas/phub?image=${encodeURIComponent(imageUrl)}&username=${encodeURIComponent(username)}&text=${encodeURIComponent(finalText)}`;

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
