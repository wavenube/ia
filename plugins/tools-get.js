import fetch from 'node-fetch';
import { format } from 'util';

const handler = async (m, { text, conn }) => {
  if (!/^https?:\/\//.test(text)) throw 'Invalid URL';

  const _url = new URL(text);

  // APIFlash URL for taking a screenshot
  const screenshotUrl = `https://api.apiflash.com/v1/urltoimage?access_key=d5d286e9336d45ef9cab64445bb06634&wait_until=page_loaded&url=${encodeURIComponent(text)}`;

  // Fetch the screenshot image
  const screenshotRes = await fetch(screenshotUrl);
  const screenshotBuffer = await screenshotRes.buffer();

  // Construct the API call to fetch the data from the URL
  const url = global.API(_url.origin, _url.pathname, Object.fromEntries(_url.searchParams.entries()), 'APIKEY');
  const res = await fetch(url);

  if (res.headers.get('content-length') > 100 * 1024 * 1024) {
    throw `Content-Length: ${res.headers.get('content-length')}`;
  }
  if (!/text|json/.test(res.headers.get('content-type'))) return conn.sendFile(m.chat, url, 'file', text, m);

  let txt = await res.buffer();
  try {
    txt = format(JSON.parse(txt + ''));
  } catch (e) {
    txt = txt + '';
  } finally {
    // Send the screenshot and the fetched data
    await conn.sendFile(m.chat, screenshotBuffer, 'screenshot.jpg', 'Here is the screenshot', m);
    m.reply(txt.slice(0, 65536) + '');
  }
};

handler.help = ['fetch', 'get'].map(v => v + ' <url>');
handler.tags = ['internet'];
handler.command = /^(fetch|get)$/i;
handler.rowner = true;

export default handler;
