import fetch from 'node-fetch';
import yts from 'yt-search'; // Utiliza yt-search para buscar videos de YouTube.
import axios from 'axios'; // Utiliza axios para hacer solicitudes HTTP.

// Función de descarga del video
let handler = async (m, { conn, args }) => {
    if (!args[0]) throw '⚠️ Debes proporcionar un enlace de YouTube válido.\n\nEjemplo: .ytmp4 https://www.youtube.com/watch?v=example';

    // Verificar que sea un enlace de YouTube
    if (!args[0].match(/(https:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/gi)) throw '❎ Proporciona un enlace de YouTube válido.';

    try {
        // Enviar un mensaje de carga
        await conn.sendMessage(m.chat, { text: '⏳ Procesando tu solicitud, espera un momento...' }, { quoted: m });

        // Obtener información del video con yt-search
        let videoSearch = await yts(args[0]);
        let video = videoSearch.videos[0]; // Selecciona el primer video de la búsqueda

        if (!video) throw '❎ No se encontró el video. Verifica el enlace y vuelve a intentarlo.';

        // Construcción del enlace de descarga usando una API externa (asegúrate de tener una API que permita la descarga de YouTube)
        let res = await axios.get(`https://api.akuari.my.id/downloader/youtube2?link=${video.url}`);
        let data = res.data;

        if (!data || !data.result || !data.result.url) throw '❎ No se pudo obtener el enlace de descarga.';

        let videoUrl = data.result.url;
        let title = video.title;
        let size = data.result.size;

        // Enviar el video
        await conn.sendMessage(m.chat, { document: { url: videoUrl }, mimetype: 'video/mp4', fileName: `${title}.mp4`, caption: `📥 *Título:* ${title}\n📦 *Tamaño:* ${size}` }, { quoted: m });

    } catch (error) {
        // En caso de error, enviar un mensaje de error
        console.error(error);
        await conn.sendMessage(m.chat, { text: '❎ Hubo un error al procesar tu solicitud. Intenta de nuevo más tarde.' }, { quoted: m });
    }
};

handler.help = ['ytmp4'];
handler.tags = ['downloader'];
handler.command = /^(ytmp4)$/i;

export default handler;
