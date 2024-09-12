import axios from 'axios';

const handler = async (m, { text }) => {
  if (!text) throw 'Por favor, proporciona una URL para acortar.';
  
  // Primera API (TinyURL)
  let apiUrlTiny = `https://deliriusapi-official.vercel.app/shorten/tinyurl?url=${encodeURIComponent(text)}`;
  let apiUrlGoogle = `https://deliriusapi-official.vercel.app/shorten/googleshort?url=${encodeURIComponent(text)}`;

  try {
    // Intentamos con la API de TinyURL
    let response = await axios.get(apiUrlTiny);
    let shortUrl = response.data.result;
    if (!shortUrl) throw new Error('No se pudo acortar el enlace con TinyURL.');
    
    // Enviar el enlace acortado si fue exitoso
    m.reply(`*Aquí está tu enlace acortado (TinyURL):* ${shortUrl}`);
  } catch (e) {
    // Si falla la API de TinyURL, intentamos con Google Short
    try {
      let responseGoogle = await axios.get(apiUrlGoogle);
      let shortUrlGoogle = responseGoogle.data.result;
      
      if (!shortUrlGoogle) throw new Error('No se pudo acortar el enlace con Google Short.');
      
      // Enviar el enlace acortado usando Google Short si fue exitoso
      m.reply(`*Aquí está tu enlace acortado (Google Short):* ${shortUrlGoogle}`);
    } catch (errorGoogle) {
      // Si ambas fallan, mostrar error
      m.reply('Ocurrió un error al intentar acortar el enlace con ambas APIs.');
    }
  }
};

handler.help = ['acortar <url>'];
handler.tags = ['tools'];
handler.command = /^(acortar|shorten|shorturl)$/i;

export default handler;
