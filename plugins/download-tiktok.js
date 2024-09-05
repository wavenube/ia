import axios from 'axios';
import cheerio from 'cheerio';
import {generateWAMessageFromContent} from "@whiskeysockets/baileys";
import {tiktokdl} from '@bochilteam/scraper';

let tiktok;
import('@xct007/frieren-scraper')
  .then((module) => {
    tiktok = module.tiktok;
  })
  .catch((error) => {
    console.error('No se pudo importar "@xct007/frieren-scraper".');
  });

const handler = async (m, {conn, text, args, usedPrefix, command}) => {
  if (!text) throw `Por favor proporciona la URL del video de TikTok. Usa el comando: _${usedPrefix + command} https://vm.tiktok.com/ejemplo_`;
  if (!/(?:https:?\/{2})?(?:w{3}|vm|vt|t)?\.?tiktok.com\/([^\s&]+)/gi.test(text)) throw `El enlace proporcionado no es válido. Usa el comando: _${usedPrefix + command} https://vm.tiktok.com/ejemplo_`;

  try {
    const aa = {quoted: m, userJid: conn.user.jid};
    const prep = generateWAMessageFromContent(m.chat, {extendedTextMessage: {text: 'Procesando tu solicitud...', contextInfo: {externalAdReply: {title: 'TikTok Downloader', body: null, thumbnail: null, sourceUrl: 'https://github.com/tu-repo'}, mentionedJid: [m.sender]}}}, aa);
    await conn.relayMessage(m.chat, prep.message, {messageId: prep.key.id, mentions: [m.sender]});

    const dataFn = await conn.getFile(`${global.MyApiRestBaseUrl}/api/tiktokv2?url=${args[0]}&apikey=${global.MyApiRestApikey}`);
    const desc1n = `Video descargado exitosamente. Usa el comando _${usedPrefix}tomp3_ para extraer el audio.`;
    await conn.sendMessage(m.chat, {video: dataFn.data, caption: desc1n}, {quoted: m});
  } catch (ee1) {
    try {
      const dataF = await tiktok.v1(args[0]);
      const desc1 = `Video descargado exitosamente. Usa el comando _${usedPrefix}tomp3_ para extraer el audio.`;
      await conn.sendMessage(m.chat, {video: {url: dataF.play}, caption: desc1}, {quoted: m});
    } catch (e1) {
      try {
        const tTiktok = await tiktokdlF(args[0]);
        const desc2 = `Video descargado. Usa el comando _${usedPrefix}tomp3_ para extraer el audio.`;
        await conn.sendMessage(m.chat, {video: {url: tTiktok.video}, caption: desc2}, {quoted: m});
      } catch (e2) {
        try {
          const {author: {nickname}, video} = await tiktokdl(args[0]);
          const url = video.no_watermark2 || video.no_watermark || 'https://tikcdn.net' + video.no_watermark_raw || video.no_watermark_hd;
          const cap = `Video de ${nickname} descargado. Usa el comando _${usedPrefix}tomp3_ para extraer el audio.`;
          await conn.sendMessage(m.chat, {video: {url: url}, caption: cap}, {quoted: m});
        } catch {
          throw `Error al descargar el video. Verifica el enlace y vuelve a intentarlo.`;
        }
      }
    }
  }
};
handler.command = /^(tiktok|ttdl|tiktokdl|tiktoknowm|tt|ttnowm|tiktokaudio)$/i;
export default handler;

async function tiktokdlF(url) {
  const gettoken = await axios.get('https://tikdown.org/id');
  const $ = cheerio.load(gettoken.data);
  const token = $('#download-form > input[type=hidden]:nth-child(2)').attr('value');
  const param = {url: url, _token: token};
  const {data} = await axios.request('https://tikdown.org/getAjax?', {
    method: 'post',
    data: new URLSearchParams(Object.entries(param)),
    headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 'user-agent': 'Mozilla/5.0'}
  });
  const getdata = cheerio.load(data.html);
  if (data.status) {
    return {status: true, thumbnail: getdata('img').attr('src'), video: getdata('div.download-links > div:nth-child(1) > a').attr('href'), audio: getdata('div.download-links > div:nth-child(2) > a').attr('href')};
  } else {
    return {status: false};
  }
}
