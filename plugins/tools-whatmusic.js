import { Shazam } from 'node-shazam';
import fetch from 'node-fetch';
import fs from 'fs';  // Importa el módulo fs

const shazam = new Shazam();

const handler = async (m, { conn }) => {
  try {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';

    if (/audio|video/.test(mime)) {
      // Descargar el archivo
      const media = await q.download();
      const ext = mime.split('/')[1];
      const tmpFilePath = `./src/tmp/${m.sender}.${ext}`;
      fs.writeFileSync(tmpFilePath, media);

      // Reconocimiento de música
      let recognise;
      if (/audio/.test(mime)) {
        recognise = await shazam.recognize(tmpFilePath, 'audio');
      } else if (/video/.test(mime)) {
        recognise = await shazam.recognize(tmpFilePath, 'video');
      }

      // Extraer información
      const { title, subtitle, artists, genres, images } = recognise.track;
      const image = await (await fetch(images.coverart)).buffer();
      const text = `Title: ${title || 'Unknown'}\nSubtitle: ${subtitle || 'Unknown'}\nGenres: ${genres.primary || 'Unknown'}`;

      // Obtener URL de video
      const apiTitle = `${title} - ${subtitle || ''}`;
      let url = 'https://github.com/BrunoSobrino'; // URL predeterminada en caso de error

      try {
        const response = await fetch(`${global.MyApiRestBaseUrl}/api/ytplay?text=${encodeURIComponent(apiTitle)}&apikey=${global.MyApiRestApikey}`);
        const data = await response.json();
        url = data.resultado.url;
      } catch (error) {
        console.error('Error al obtener la URL del video:', error);
      }

      // Obtener enlace de audio
      const audiolink = `${global.MyApiRestBaseUrl}/api/v1/ytmp3?url=${encodeURIComponent(url)}&apikey=${global.MyApiRestApikey}`;
      const audiobuff = await fetch(audiolink).then(res => res.buffer());

      // Enviar mensaje de texto con información
      await conn.sendMessage(m.chat, {
        text: text.trim(),
        contextInfo: {
          forwardingScore: 9999999,
          isForwarded: true,
          "externalAdReply": {
            "showAdAttribution": true,
            "containsAutoReply": true,
            "renderLargerThumbnail": true,
            "title": apiTitle,
            "containsAutoReply": true,
            "mediaType": 1,
            "thumbnail": image,
            "thumbnailUrl": image,
            "mediaUrl": url,
            "sourceUrl": url
          }
        }
      }, { quoted: m });

      // Enviar el archivo de audio
      await conn.sendMessage(m.chat, {
        audio: audiobuff,
        fileName: `${title}.mp3`,
        mimetype: 'audio/mpeg'
      }, { quoted: m });

      // Eliminar archivo temporal
      fs.unlinkSync(tmpFilePath);
    } else {
      throw new Error('Please send an audio or video file.');
    }
  } catch (error) {
    await conn.sendMessage(m.chat, { text: `Error: ${error.message}` }, { quoted: m });
  }
};

handler.command = /^(quemusica|quemusicaes|whatmusic|shazam)$/i;

export default handler;
