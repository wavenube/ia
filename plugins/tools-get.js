import fetch from 'node-fetch';
import cheerio from 'cheerio';

const handler = async (m, { text, conn }) => {
  if (!/^https?:\/\//.test(text)) throw 'Invalid URL';

  const _url = new URL(text);

  // APIFlash URL for taking a screenshot
  const screenshotUrl = `https://api.apiflash.com/v1/urltoimage?access_key=d5d286e9336d45ef9cab64445bb06634&wait_until=page_loaded&url=${encodeURIComponent(text)}`;

  // Fetch the screenshot image
  const screenshotRes = await fetch(screenshotUrl);
  const screenshotBuffer = await screenshotRes.buffer();

  // Fetch the HTML content of the URL
  const res = await fetch(text);
  if (res.status !== 200) throw `Failed to fetch ${text}`;

  const html = await res.text();
  const $ = cheerio.load(html);

  // Extract the title and description
  const title = $('title').text() || 'No title found';
  const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || 'No description found';

  // (Optional) Fetch Trustpilot reviews using the Trustpilot API if you have an API key
  // Example URL structure: `https://api.trustpilot.com/v1/business-units/find?name=${encodeURIComponent(text)}`
  // Note: This is a placeholder for actual Trustpilot API integration.
  const trustpilotReviews = 'No reviews found on Trustpilot'; // Placeholder

  // Construct the formatted response
  const formattedResponse = `
🌐 *Title:* ${title}
📝 *Description:* ${description}
⭐ *Trustpilot Reviews:* ${trustpilotReviews}
  `;

  // Send the screenshot and the formatted response
  await conn.sendFile(m.chat, screenshotBuffer, 'screenshot.jpg', 'Here is the screenshot', m);
  m.reply(formattedResponse);
};

handler.help = ['fetch', 'get'].map(v => v + ' <url>');
handler.tags = ['internet'];
handler.command = /^(fetch|get)$/i;
handler.rowner = true;

export default handler;
