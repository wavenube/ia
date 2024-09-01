import fg from 'api-dylux';
import axios from 'axios';
import cheerio from 'cheerio';
import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import { tiktokdl } from '@bochilteam/scraper';

let tiktok;
import('@xct007/frieren-scraper')
  .then((module) => {
    tiktok = module.tiktok;
  })
  .catch((error) => {
    console.error('No se pudo importar "@xct007/frieren-scraper".');
  });

const handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!text) throw `Por favor, proporciona un enlace de TikTok.`;
  if (!/(?:https?:\/\/)?(?:www\.|vm\.|vt\.|t)?tiktok\.com\/([^\s&]+)/gi.test(text)) throw `Enlace de TikTok inválido.`;

  const texto = `Selecciona la opción para descargar el video de TikTok.`;

  try {
    // Preparar el mensaje
    const aa = { quoted: m, userJid: conn.user.jid };
    const prep = generateWAMessageFromContent(m.chat, {
      extendedTextMessage: {
        text: texto,
        contextInfo: {
          externalAdReply: {
            title: 'Descargar Video de TikTok',
            body: null,
            thumbnail: './media/contact.png',
            sourceUrl: 'https://github.com/BrunoSobrino/TheMystic-Bot-MD'
          },
          mentionedJid: [m.sender]
        }
      }
    }, aa);

    await conn.relayMessage(m.chat, prep.message, { messageId: prep.key.id, mentions: [m.sender] });

    // Intentar obtener el video de TikTok de diferentes fuentes
    try {
      const dataFn = await conn.getFile(`${global.MyApiRestBaseUrl}/api/tiktokv2?url=${encodeURIComponent(args[0])}&apikey=${global.MyApiRestApikey}`);
      const desc1 = `Aquí está tu video de TikTok. Usa _${usedPrefix}tomp3_ para convertirlo a audio.`;
      await conn.sendMessage(m.chat, { video: dataFn.data, caption: desc1 }, { quoted: m });
    } catch (error) {
      try {
        const dataF = await tiktok.v1(args[0]);
        const desc1 = `Aquí está tu video de TikTok. Usa _${usedPrefix}tomp3_ para convertirlo a audio.`;
        await conn.sendMessage(m.chat, { video: { url: dataF.play }, caption: desc1 }, { quoted: m });
      } catch (error) {
        try {
          const tTiktok = await tiktokdlF(args[0]);
          const desc2 = `Aquí está tu video de TikTok. Usa _${usedPrefix}tomp3_ para convertirlo a audio.`;
          await conn.sendMessage(m.chat, { video: { url: tTiktok.video }, caption: desc2 }, { quoted: m });
        } catch (error) {
          try {
            const p = await fg.tiktok(args[0]);
            const te = `Aquí está tu video de TikTok. Usa _${usedPrefix}tomp3_ para convertirlo a audio.`;
            await conn.sendMessage(m.chat, { video: { url: p.nowm }, caption: te }, { quoted: m });
          } catch (error) {
            try {
              const { author: { nickname }, video, description } = await tiktokdl(args[0]);
              const url = video.no_watermark2 || video.no_watermark || 'https://tikcdn.net' + video.no_watermark_raw || video.no_watermark_hd;
              const cap = `Aquí está tu video de TikTok. Usa _${usedPrefix}tomp3_ para convertirlo a audio.`;
              await conn.sendMessage(m.chat, { video: { url: url }, caption: cap }, { quoted: m });
            } catch {
              throw `Lo siento, no se pudo procesar el enlace de TikTok.`;
            }
          }
        }
      }
    }
  } catch (error) {
    throw `Error al procesar el enlace de TikTok: ${error.message}`;
  }
};

// Configuración del comando
handler.command = /^(tiktok|ttdl|tiktokdl|tiktoknowm|tt|ttnowm|tiktokaudio)$/i;
export default handler;

async function tiktokdlF(url) {
  if (!/tiktok/.test(url)) return `Por favor, proporciona un enlace de TikTok válido.`;
  const gettoken = await axios.get('https://tikdown.org/id');
  const $ = cheerio.load(gettoken.data);
  const token = $('#download-form > input[type=hidden]:nth-child(2)').attr('value');
  const param = { url: url, _token: token };
  const { data } = await axios.post('https://tikdown.org/getAjax?', new URLSearchParams(Object.entries(param)), {
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'user-agent': 'Mozilla/5.0'
    }
  });
  const getdata = cheerio.load(data.html);
  if (data.status) {
    return { status: true, thumbnail: getdata('img').attr('src'), video: getdata('div.download-links > div:nth-child(1) > a').attr('href'), audio: getdata('div.download-links > div:nth-child(2) > a').attr('href') };
  } else {
    return { status: false };
  }
}
