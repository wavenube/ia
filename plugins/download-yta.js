import fetch from 'node-fetch';
import yts from 'yt-search';
import axios from 'axios';
import ytmp33 from '../lib/ytmp33.js';

let limit = 50;
let enviando = false;

const handler = async (m, { text, conn, args, usedPrefix, command }) => {
  if (!args[0]) throw "Por favor, proporciona un enlace de YouTube o el número de un video.";

  if (enviando) return;
  enviando = true;

  let youtubeLink = '';
  if (args[0].includes('you')) {
    youtubeLink = args[0];
  } else {
    const index = parseInt(args[0]) - 1;
    if (index >= 0) {
      if (Array.isArray(global.videoList) && global.videoList.length > 0) {
        const matchingItem = global.videoList.find((item) => item.from === m.sender);
        if (matchingItem) {
          if (index < matchingItem.urls.length) {
            youtubeLink = matchingItem.urls[index];
          } else {
            enviando = false;
            throw `Solo hay ${matchingItem.urls.length} enlaces disponibles.`;
          }
        } else {
          enviando = false;
          throw `No se encontraron enlaces guardados. Usa el comando ${usedPrefix}playlist <texto> para obtener una lista.`;
        }
      } else {
        enviando = false;
        throw `No se encontraron enlaces guardados. Usa el comando ${usedPrefix}playlist <texto> para obtener una lista.`;
      }
    }
  }

  const { key } = await conn.sendMessage(m.chat, { text: "Procesando tu solicitud, por favor espera..." }, { quoted: m });

  try {
    const { status, resultados, error } = await ytmp33(youtubeLink);
    if (!status) {
      enviando = false;
      throw new Error(error);
    }
    const buff_aud = await getBuffer(resultados.descargar);
    const fileSizeInBytes = buff_aud.byteLength;
    const fileSizeInKB = fileSizeInBytes / 1024;
    const fileSizeInMB = fileSizeInKB / 1024;
    const roundedFileSizeInMB = fileSizeInMB.toFixed(2);
    const title = resultados.titulo;

    if (fileSizeInMB > limit) {
      enviando = false;
      await conn.sendMessage(m.chat, { document: buff_aud, caption: `Aquí tienes el archivo de audio: ${title}\nTamaño: ${roundedFileSizeInMB} MB`, fileName: title + '.mp3', mimetype: 'audio/mpeg' }, { quoted: m });
    } else {
      enviando = false;
      await conn.sendMessage(m.chat, { audio: buff_aud, caption: `Aquí tienes el archivo de audio: ${title}\nTamaño: ${roundedFileSizeInMB} MB`, fileName: title + '.mp3', mimetype: 'audio/mpeg' }, { quoted: m });
    }
    await conn.sendMessage(m.chat, { text: "Tu archivo de audio ha sido enviado con éxito.", edit: key }, { quoted: m });
    enviando = false;

  } catch (error) {
    try {
      const yt_play = await yts(youtubeLink);
      const audioUrl = `${global.MyApiRestBaseUrl}/api/v1/ytmp3?url=${yt_play.all[0].url}&apikey=${global.MyApiRestApikey}`;
      const buff_aud = await getBuffer(audioUrl);
      const fileSizeInBytes = buff_aud.byteLength;
      const fileSizeInKB = fileSizeInBytes / 1024;
      const fileSizeInMB = fileSizeInKB / 1024;
      const roundedFileSizeInMB = fileSizeInMB.toFixed(2);
      const title = yt_play.all[0].title;

      if (fileSizeInMB > limit) {
        enviando = false;
        await conn.sendMessage(m.chat, { document: buff_aud, caption: `Aquí tienes el archivo de audio: ${title}\nTamaño: ${roundedFileSizeInMB} MB`, fileName: title + '.mp3', mimetype: 'audio/mpeg' }, { quoted: m });
      } else {
        enviando = false;
        await conn.sendMessage(m.chat, { audio: buff_aud, caption: `Aquí tienes el archivo de audio: ${title}\nTamaño: ${roundedFileSizeInMB} MB`, fileName: title + '.mp3', mimetype: 'audio/mpeg' }, { quoted: m });
      }
      await conn.sendMessage(m.chat, { text: "Tu archivo de audio ha sido enviado con éxito.", edit: key }, { quoted: m });
      enviando = false;
    } catch (error) {  
      try {
        const yt_play = await yts(youtubeLink);
        const audioUrl = `${global.MyApiRestBaseUrl}/api/v2/ytmp3?url=${yt_play.all[0].url}&apikey=${global.MyApiRestApikey}`;
        const buff_aud = await getBuffer(audioUrl);
        const fileSizeInBytes = buff_aud.byteLength;
        const fileSizeInKB = fileSizeInBytes / 1024;
        const fileSizeInMB = fileSizeInKB / 1024;
        const roundedFileSizeInMB = fileSizeInMB.toFixed(2);
        const title = yt_play.all[0].title;

        if (fileSizeInMB > limit) {
          enviando = false;
          await conn.sendMessage(m.chat, { document: buff_aud, caption: `Aquí tienes el archivo de audio: ${title}\nTamaño: ${roundedFileSizeInMB} MB`, fileName: title + '.mp3', mimetype: 'audio/mpeg' }, { quoted: m });
        } else {
          enviando = false;
          await conn.sendMessage(m.chat, { audio: buff_aud, caption: `Aquí tienes el archivo de audio: ${title}\nTamaño: ${roundedFileSizeInMB} MB`, fileName: title + '.mp3', mimetype: 'audio/mpeg' }, { quoted: m });
        }
        await conn.sendMessage(m.chat, { text: "Tu archivo de audio ha sido enviado con éxito.", edit: key }, { quoted: m });
        enviando = false;
      } catch (error) {
        enviando = false;
        await conn.sendMessage(m.chat, { text: "Lo siento, ocurrió un error al procesar tu solicitud.", edit: key }, { quoted: m });
        throw "Error al procesar el audio de YouTube.";
      } 
    }
  } finally {
    enviando = false;
  }
};

handler.command = /^(audio|fgmp3|dlmp3|getaud|yt(a|mp3))$/i;
export default handler;

const getBuffer = async (url, options) => {
  try {
    options ? options : {};
    const res = await axios({
      method: 'get',
      url,
      headers: {
        'DNT': 1,
        'Upgrade-Insecure-Request': 1,
      },
      ...options,
      responseType: 'arraybuffer',
    });
    return res.data;
  } catch (e) {
    console.log(`Error : ${e}`);
  }
};
