import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*Uso correcto: ${usedPrefix + command} <enlace de tiktok>*`;

  const url = text.trim();
  if (!url.match(/(https?:\/\/)?(www\.)?(tiktok\.com)\/.+/i)) {
    throw '*Por favor, ingresa una URL válida de TikTok.*';
  }

  try {
    m.reply('*⏳ Descargando el video...*');

    // Llamada a la API de ttdownloader.com
    const apiUrl = `https://ttdownloader.com/req`;
    const body = new URLSearchParams({ url });

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    const html = await response.text();
    const videoUrl = html.match(/href="(https:\/\/.*?\.mp4)"/)?.[1]; // Extraer el enlace de video

    if (!videoUrl) {
      throw '*Hubo un error al obtener el video. Verifica la URL o intenta más tarde.*';
    }

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
