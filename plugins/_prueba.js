import fetch from 'node-fetch';
import cheerio from 'cheerio';

const handler = async (m, { text, conn }) => {
  if (!/^https?:\/\//.test(text)) throw 'Invalid URL';

  const _url = new URL(text);

  // Método para captura de pantalla usando tu código anterior
  const screenshotUrl = `https://image.thum.io/get/fullpage/${encodeURIComponent(text)}`;

  try {
    // Obtener la captura de pantalla
    const screenshotBuffer = await (await fetch(screenshotUrl)).buffer();

    // Fetch del contenido HTML de la URL
    const res = await fetch(text);
    if (res.status !== 200) throw `Failed to fetch ${text}`;

    const html = await res.text();
    const $ = cheerio.load(html);

    // Extraer título y descripción
    const title = $('title').text() || 'No title found';
    const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || 'No description found';

    // Búsqueda de Trustpilot usando el título
    const trustpilotSearchUrl = `https://www.trustpilot.com/search?query=${encodeURIComponent(title)}`;
    const trustpilotRes = await fetch(trustpilotSearchUrl);
    const trustpilotHtml = await trustpilotRes.text();
    const $$ = cheerio.load(trustpilotHtml);

    let trustpilotReviews = 'No reviews found on Trustpilot';

    // Extraer reseñas de Trustpilot
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

    // Enviar la captura de pantalla y luego la información
    await conn.sendFile(m.chat, screenshotBuffer, 'screenshot.jpg', 'Here is the screenshot', m);
    m.reply(formattedResponse);
  } catch (e) {
    m.reply(`Error: ${e.message}`);
  }
};

handler.help = ['si', 'get'].map(v => v + ' <url>');
handler.tags = ['internet'];
handler.command = /^(si|get)$/i;
handler.rowner = false;

export default handler;
