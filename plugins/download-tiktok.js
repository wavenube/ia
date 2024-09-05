import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*Uso correcto: ${usedPrefix + command} <enlace de tiktok>*`;

  const url = text.trim();
  if (!url.match(/(https?:\/\/)?(www\.)?(tiktok\.com)\/.+/i)) {
    throw '*Por favor, ingresa una URL válida de TikTok.*';
  }

  try {
    m.reply('*⏳ Descargando el video...*');

    // Llamada a la API para descargar el video de TikTok sin marca de agua
    const response = await fetch(`https://ssstik.io/api/your_api_key?url=${url}`);
    const json = await response.json();

    if (json.status !== 'ok') {
      throw '*Hubo un error al obtener el video. Verifica la URL o intenta más tarde.*';
    }

    const videoUrl = json.result.nowatermark;  // URL del video sin marca de agua

    await conn.sendFile(m.chat, videoUrl, 'tiktok.mp4', `*Aquí está tu video de TikTok sin marca de agua*`, m);
  } catch (e) {
    console.error(e);
    throw '*Lo siento, ocurrió un error al procesar tu solicitud. Inténtalo de nuevo más tarde.*';
  }
};

handler.help = ['tiktok'];
handler.tags = ['downloader'];
handler.command = /^(tiktok|tiktokdl)$/i;

export default handler;
