import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command, args }) => {
  if (!args[0]) {
    return m.reply(`🛸 Uso correcto del comando: *${usedPrefix + command}* texto`);
  }

  let query = args.join(' ');
  let apiUrl = `https://deliriusapi-official.vercel.app/search/rule34?query=${encodeURIComponent(query)}`;

  try {
    // Solicita la búsqueda a la API
    let response = await axios.get(apiUrl);
    let results = response.data.results;

    if (results.length === 0) {
      return m.reply('No se encontraron imágenes para la búsqueda.');
    }

    // Envía cada imagen encontrada
    for (let result of results) {
      await conn.sendMessage(m.chat, { image: { url: result.url }, caption: `Resultado de búsqueda para: ${query}` }, { quoted: m });
    }
  } catch (e) {
    // Maneja el error si la solicitud falla
    m.reply(`Ocurrió un error al buscar imágenes. Detalles: ${e.message}`);
  }
};

handler.help = ['r34 <texto>'];
handler.tags = ['search'];
handler.command = ['r34'];

export default handler;
