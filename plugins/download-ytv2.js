import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
  // Verifica que se haya proporcionado un enlace
  if (!args[0]) return conn.sendMessage(m.chat, { text: '❌ Proporcione el enlace de YouTube.' });

  // Verifica que el enlace sea de YouTube
  if (!args[0].match(/youtube\.com|youtu\.be/gi)) return conn.sendMessage(m.chat, { text: '❌ Enlace inválido. Proporcione un enlace válido de YouTube.' });

  try {
    // Realiza la solicitud a la API que proporcionaste
    const res = await fetch(`https://myaitest-3akm.onrender.com/ytdlv?apikey=sicuani&q=${args[0]}`);
    const json = await res.json();

    // Verifica si la API devolvió los datos correctamente
    if (!json || !json.data || !json.data.videoUrl) return conn.sendMessage(m.chat, { text: '❎ Hubo un error al procesar tu solicitud. Intenta de nuevo más tarde.' });

    const { videoUrl, title } = json.data;
    
    // Descarga y envía el video al chat
    await conn.sendMessage(m.chat, { text: '⏳ Descargando el video, por favor espera...' });
    await conn.sendFile(m.chat, videoUrl, `${title}.mp4`, `🎥 Título: ${title}`, m);

  } catch (error) {
    // Muestra un mensaje de error si algo falla
    console.error(error);
    conn.sendMessage(m.chat, { text: '❎ Hubo un error al procesar tu solicitud. Intenta de nuevo más tarde.' });
  }
};

handler.command = /^(ytmp44)$/i;
export default handler;
