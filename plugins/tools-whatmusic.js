import { Shazam } from 'node-shazam';
import fetch from 'node-fetch';
import fs from 'fs';

const shazam = new Shazam();

const handler = async (m) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || '';

  if (/audio|video/.test(mime)) {
    const media = await q.download();
    const ext = mime.split('/')[1];
    fs.writeFileSync(`./tmp/${m.sender}.${ext}`, media);

    let recognise;
    if (/audio/.test(mime)) {
      recognise = await shazam.fromFilePath(`./tmp/${m.sender}.${ext}`, false, 'en');
    } else if (/video/.test(mime)) {
      recognise = await shazam.fromVideoFile(`./tmp/${m.sender}.${ext}`, false, 'en');
    }

    const { title, subtitle, genres, images } = recognise.track;
    const imagen = await fetch(images.coverart).then(res => res.buffer());
    const texto = `Title: ${title || 'Unknown'}\nSubtitle: ${subtitle || 'Unknown'}\nGenres: ${genres.primary || 'Unknown'}`;

    const apiTitle = `${title} - ${subtitle || ''}`;

    let url = 'https://github.com/BrunoSobrino'; 
    try {
      const response = await fetch(`${global.MyApiRestBaseUrl}/api/ytplay?text=${encodeURIComponent(apiTitle)}&apikey=${global.MyApiRestApikey}`);
      const data = await response.json();
      url = data.resultado.url;
    } catch (error) {
      console.error('Error al obtener la URL del video:', error);
    }

    const audiolink = `${global.MyApiRestBaseUrl}/api/v1/ytmp3?url=${encodeURIComponent(url)}&apikey=${global.MyApiRestApikey}`;  
    const audiobuff = await fetch(audiolink).then(res => res.buffer());

    await conn.sendMessage(m.chat, { 
      text: texto.trim(), 
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
          "thumbnail": imagen, 
          "thumbnailUrl": images.coverart, 
          "mediaUrl": url, 
          "sourceUrl": url 
        } 
      } 
    }, { quoted: m });

    await conn.sendMessage(m.chat, { 
      audio: audiobuff, 
      fileName: `${title}.mp3`, 
      mimetype: 'audio/mpeg' 
    }, { quoted: m });

    fs.unlinkSync(`./tmp/${m.sender}.${ext}`);
  } else {
    throw new Error('Please send an audio or video file.');
  }
};

handler.command = /^(quemusica|quemusicaes|whatmusic|shazam)$/i;
export default handler;
