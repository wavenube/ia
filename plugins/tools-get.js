import fetch from 'node-fetch';
import cheerio from 'cheerio';

const handler = async (m, { text, conn, args }) => {
  if (!args[0]) return conn.reply(m.chat, 'Por favor, proporciona una URL válida.', m);

  // Enviar captura de pantalla de la URL
  try {
    const ss = await (await fetch(`https://image.thum.io/get/fullpage/${args[0]}`)).buffer();
    await conn.sendFile(m.chat, ss, '', '', m);
  } catch {
    try {
      const ss2 = `https://api.screenshotmachine.com/?key=c04d3a&url=${args[0]}&dimension=720x720`;
      await conn.sendMessage(m.chat, { image: { url: ss2 } }, { quoted: m });
    } catch {
      try {
        const ss3 = `https://api.lolhuman.xyz/api/SSWeb?apikey=${lolkeysapi}&url=${text}`;
        await conn.sendMessage(m.chat, { image: { url: ss3 } }, { quoted: m });
      } catch {
        const ss4 = `https://api.lolhuman.xyz/api/SSWeb2?apikey=${lolkeysapi}&url=${text}`;
        await conn.sendMessage(m.chat, { image: { url: ss4 } }, { quoted: m });
      }
    }
  }

  // Extraer título, descripción y reseñas de Trustpilot
  const res = await fetch(text);
  if (res.status !== 200) throw `Failed to fetch ${text}`;

  const html = await res.text();
  const $ = cheerio.load(html);

  const title = $('title').text() || 'No title found';
  const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || 'No description found';

  const trustpilotSearchUrl = `https://www.trustpilot.com/search?query=${encodeURIComponent(title)}`;
  const trustpilotRes = await fetch(trustpilotSearchUrl);
  const trustpilotHtml = await trustpilotRes.text();
  const $$ = cheerio.load(trustpilotHtml);

  let trustpilotReviews = 'No reviews found on Trustpilot';
  const trustpilotLink = $$('a[href*="/review/"]').first().attr('href');
  if (trustpilotLink) {
    const reviewUrl = `https://www.trustpilot.com${trustpilotLink}`;
    trustpilotReviews = `Reviews found: [Trustpilot](${reviewUrl})`;
  }

  // Respuesta formateada
  const formattedResponse = `
🌐 *Title:* ${title}
📝 *Description:* ${description}
⭐ *Trustpilot Reviews:* ${trustpilotReviews}
  `;

  // Enviar la información extraída
  m.reply(formattedResponse);
};

handler.help = ['fetch', 'get'].map(v => v + ' <url>');
handler.tags = ['internet'];
handler.command = /^(fetch|get)$/i;

export default handler;
