import { Shazam } from 'node-shazam';
import fetch from 'node-fetch';
import fs from 'fs';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';

const shazam = new Shazam();

const handler = async (m, { conn }) => {
  try {
    const datas = global;
    const idioma = datas.db.data.users[m.sender].language;
    const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
    const traductor = _translate.plugins.herramientas_whatmusic;

    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';
    if (/audio|video/.test(mime)) {
      const media = await q.download();
      const ext = mime.split('/')[1];
      const tmpFilePath = `./src/tmp/${m.sender}.${ext}`;
      fs.writeFileSync(tmpFilePath, media);

      let recognise;
      if (/audio/.test(mime)) {
        recognise = await shazam.fromFilePath(tmpFilePath, false, 'en');
      } else if (/video/.test(mime)) {
        recognise = await shazam.fromVideoFile(tmpFilePath, false, 'en');
      }

      const { title, subtitle, artists, genres, images } = recognise.track;
      const image = await (await fetch(images.coverart)).buffer();
      const text = `${traductor.texto3[0]}\n\n${traductor.texto3[1]} ${title || traductor.texto2}\n${traductor.texto3[2]} ${subtitle || traductor.texto2}\n${traductor.texto3[4]} ${genres.primary || traductor.texto2}`;

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

      await conn.sendMessage(m.chat, { text: text.trim(), contextInfo: { forwardingScore: 9999999, isForwarded: true, "externalAdReply": { "showAdAttribution": true, "containsAutoReply": true, "renderLargerThumbnail": true, "title": apiTitle, "containsAutoReply": true, "mediaType": 1, "thumbnail": image, "thumbnailUrl": image, "mediaUrl": url, "sourceUrl": url } } }, { quoted: m });

      await conn.sendMessage(m.chat, { audio: audiobuff, fileName: `${title}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m });

      fs.unlinkSync(tmpFilePath);
    } else {
      throw traductor.texto4;
    }
  } catch (error) {
    await conn.sendMessage(m.chat, { text: `Error: ${error.message}` }, { quoted: m });
  }
};

handler.command = /^(quemusica|quemusicaes|whatmusic|shazam)$/i;

export default handler;
