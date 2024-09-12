import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command, args }) => {
  if (!args[0]) {
    return m.reply(`🛸 Uso correcto del comando: *${usedPrefix + command}* nombre del anime`);
  }

  let query = args.join(' ');
  let apiUrl = `https://deliriusapi-official.vercel.app/anime/animeinfo?query=${encodeURIComponent(query)}`;

  try {
    // Solicitar la información del anime a la API
    let response = await axios.get(apiUrl);

    // Verificar que la respuesta contenga datos válidos
    if (!response.data || response.data.error || !response.data.title) {
      return m.reply('No se encontró información para el anime solicitado.');
    }

    let anime = response.data;

    // Crear la cadena con la información del anime
    let info = `📺 *Título:* ${anime.title}
📝 *Sinopsis:* ${anime.synopsis}
🎭 *Géneros:* ${anime.genres ? anime.genres.join(', ') : 'Desconocido'}
📆 *Fecha de emisión:* ${anime.aired || 'Desconocido'}
⭐ *Puntuación:* ${anime.score || 'No disponible'}
🔗 *URL:* ${anime.url || 'No disponible'}`;

    // Enviar la información en el chat
    await conn.sendMessage(m.chat, { text: info }, { quoted: m });
  } catch (e) {
    // Manejar el error si la solicitud falla
    m.reply(`Ocurrió un error al buscar la información del anime. Detalles: ${e.message}`);
  }
};

handler.help = ['animeinfo <nombre>'];
handler.tags = ['anime'];
handler.command = ['animeinfo'];

export default handler;
