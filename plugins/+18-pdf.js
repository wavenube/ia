import fetch from 'node-fetch';
import PDFDocument from 'pdfkit';
import { extractImageThumb } from '@whiskeysockets/baileys';
import fs from 'fs';
import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  const datas = global;
  const idioma = datas.db.data.users[m.sender].language;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
  const tradutor = _translate.plugins.adult_hentaipdf;

  if (!db.data.chats[m.chat].modohorny && m.isGroup) throw tradutor.texto1;
  if (!text) throw `${tradutor.texto2} ${usedPrefix + command} ${tradutor.texto2_1}`;

  try {
    m.reply(global.wait);

    // Reemplaza `lolkeysapi` con la clave API correcta si no está definida
    const lolkeysapi = global.lolkeysapi || 'YOUR_API_KEY_HERE';
    
    // Fetch NHentai search results
    const res = await fetch(`https://api.lolhuman.xyz/api/nhentaisearch?apikey=${lolkeysapi}&query=${text}`);
    const json = await res.json();
    const aa = json.result[0].id;
    
    // Fetch NHentai data
    const data = await nhentaiScraper(aa);
    const pages = [];
    const thumb = `https://external-content.duckduckgo.com/iu/?u=https://t.nhentai.net/galleries/${data.media_id}/thumb.jpg`;
    
    data.images.pages.forEach((v, i) => {
      const ext = new URL(v.t).pathname.split('.')[1];
      pages.push(`https://external-content.duckduckgo.com/iu/?u=https://i7.nhentai.net/galleries/${data.media_id}/${i + 1}.${ext}`);
    });

    // Generate PDF
    const buffer = await (await fetch(thumb)).buffer();
    const jpegThumbnail = await extractImageThumb(buffer);
    const imagepdf = await toPDF(pages);

    await conn.sendMessage(m.chat, {
      document: imagepdf,
      jpegThumbnail,
      fileName: `${data.title.english}.pdf`,
      mimetype: 'application/pdf'
    }, { quoted: m });

  } catch (error) {
    console.error('Error en la solicitud:', error); // Imprime el error para depuración
    throw `${tradutor.texto3}`;
  }
};

handler.command = /^(hentaipdf)$/i;
export default handler;

async function nhentaiScraper(id) {
  const uri = id ? `https://cin.guru/v/${+id}/` : 'https://cin.guru/';
  const html = (await axios.get(uri)).data;
  return JSON.parse(html.split('<script id="__NEXT_DATA__" type="application/json">')[1].split('</script>')[0]).props.pageProps.data;
}

function toPDF(images, opt = {}) {
  return new Promise(async (resolve, reject) => {
    if (!Array.isArray(images)) images = [images];
    const buffs = [];
    const doc = new PDFDocument({ margin: 0, size: 'A4' });

    for (let x = 0; x < images.length; x++) {
      if (/.webp|.gif/.test(images[x])) continue;
      try {
        const data = (await axios.get(images[x], { responseType: 'arraybuffer', ...opt })).data;
        doc.image(data, 0, 0, { fit: [595.28, 841.89], align: 'center', valign: 'center' });
        if (images.length !== x + 1) doc.addPage();
      } catch (err) {
        console.error(`Error al procesar la imagen ${images[x]}:`, err); // Imprime el error de la imagen
        continue;
      }
    }

    doc.on('data', chunk => buffs.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffs)));
    doc.on('error', err => reject(err));
    doc.end();
  });
}

