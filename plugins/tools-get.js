import fetch from 'node-fetch';
import { format } from 'util';

const handler = async (m, { text }) => {
  if (!/^https?:\/\//.test(text)) throw 'URL inválida. Asegúrate de incluir "http://" o "https://".';

  const _url = new URL(text);
  const url = global.API(_url.origin, _url.pathname, Object.fromEntries(_url.searchParams.entries()), 'APIKEY');
  
  // Captura de pantalla
  const screenshotUrl = `https://shot.screenshotapi.net/screenshot?&url=${encodeURIComponent(text)}&width=1280&height=720&output=image&file_type=png`;
  const screenshotRes = await fetch(screenshotUrl);
  const screenshotBuffer = await screenshotRes.buffer();

  const res = await fetch(url);
  if (res.headers.get('content-length') > 100 * 1024 * 1024 * 1024) {
    throw `Content-Length: ${res.headers.get('content-length')}`;
  }
  if (!/text|json/.test(res.headers.get('content-type'))) {
    await conn.sendFile(m.chat, url, 'file', text, m);
  } else {
    let txt = await res.buffer();
    try {
      txt = format(JSON.parse(txt + ''));
    } catch (e) {
      txt = txt + '';
    } finally {
      await conn.sendFile(m.chat, screenshotBuffer, 'screenshot.png', 'Previsualización de la página:', m);
      m.reply(txt.slice(0, 65536) + '');
    }
  }
};

handler.help = ['fetch', 'get'].map((v) => v + ' <url>');
handler.tags = ['internet'];
handler.command = /^(fetch|get)$/i;
handler.rowner = true;
export default handler;
