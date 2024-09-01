import axios from 'axios';
import fetch from 'node-fetch';
import { generateWAMessageFromContent } from '@adiwajshing/baileys'; // Importar esta función para enviar mensajes con botones

const handler = async (m, { command, conn }) => {

  if (!db.data.chats[m.chat].modohorny && m.isGroup) throw 'Este comando no está permitido en este grupo.';

  const sendInteractiveMessage = async (m, conn, imageUrl, command) => {
    const button = [{ buttonId: `${command}`, buttonText: { displayText: 'Siguiente' }, type: 1 }];
    const buttonMessage = {
      image: { url: imageUrl },
      caption: `_${command}_`.trim(),
      buttons: button,
      footer: 'Presiona el botón para ver otra imagen.',
      headerType: 4
    };
    conn.sendMessage(m.chat, buttonMessage, { quoted: m });
  };

  const sendNsfwImage = async (url, command) => {
    const res = (await axios.get(url)).data;
    const imageUrl = res[Math.floor(res.length * Math.random())];
    await sendInteractiveMessage(m, conn, imageUrl, command);
  };

  switch (command) {
    case 'nsfwloli':
      await sendNsfwImage(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwloli.json`, command);
      break;
    case 'nsfwfoot':
      await sendNsfwImage(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwfoot.json`, command);
      break;
    case 'nsfwass':
      await sendNsfwImage(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwass.json`, command);
      break;
    case 'nsfwbdsm':
      await sendNsfwImage(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwbdsm.json`, command);
      break;
    case 'nsfwcum':
      conn.sendMessage(m.chat, { image: { url: `${global.MyApiRestBaseUrl}/api/nsfw/nsfwcum&apikey=${global.MyApiRestApikey}` }, caption: `_${command}_`.trim(), buttons: [{ buttonId: `${command}`, buttonText: { displayText: 'Siguiente' }, type: 1 }], footer: 'Presiona el botón para ver otra imagen.' }, { quoted: m });
      break;
    case 'nsfwero':
      await sendNsfwImage(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwero.json`, command);
      break;
    case 'nsfwfemdom':
      await sendNsfwImage(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwfemdom.json`, command);
      break;
    case 'nsfwglass':
      await sendNsfwImage(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwglass.json`, command);
      break;
    case 'nsfworgy':
      await sendNsfwImage(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfworgy.json`, command);
      break;
    case 'tetas':
      const resTetas = (await axios.get(`https://api-fgmods.ddns.net/api/nsfw/boobs?apikey=fg-dylux`)).data || (await axios.get(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/tetas.json`)).data;
      const imageTetas = resTetas[Math.floor(resTetas.length * Math.random())];
      conn.sendMessage(m.chat, { image: { url: imageTetas }, caption: `_${command}_`.trim(), buttons: [{ buttonId: `${command}`, buttonText: { displayText: 'Siguiente' }, type: 1 }], footer: 'Presiona el botón para ver otra imagen.' }, { quoted: m });
      break;
    case 'booty':
      const resBooty = (await axios.get(`https://api-fgmods.ddns.net/api/nsfw/ass?apikey=fg-dylux`)).data || (await axios.get(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/booty.json`)).data;
      const imageBooty = resBooty[Math.floor(resBooty.length * Math.random())];
      conn.sendMessage(m.chat, { image: { url: imageBooty }, caption: `_${command}_`.trim(), buttons: [{ buttonId: `${command}`, buttonText: { displayText: 'Siguiente' }, type: 1 }], footer: 'Presiona el botón para ver otra imagen.' }, { quoted: m });
      break;
    case 'ecchi':
      await sendNsfwImage(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/ecchi.json`, command);
      break;
    case 'furro':
      await sendNsfwImage(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/furro.json`, command);
      break;
    case 'trapito':
      const resTrapito = await fetch(`https://api.waifu.pics/nsfw/trap`);
      const jsonTrapito = await resTrapito.json();
      conn.sendMessage(m.chat, { image: { url: jsonTrapito.url }, caption: `_${command}_`.trim(), buttons: [{ buttonId: `${command}`, buttonText: { displayText: 'Siguiente' }, type: 1 }], footer: 'Presiona el botón para ver otra imagen.' }, { quoted: m });
      break;
    case 'imagenlesbians':
      const resLesbians = (await axios.get(`https://api-fgmods.ddns.net/api/nsfw/lesbian?apikey=fg-dylux`)).data || (await axios.get(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/imagenlesbians.json`)).data;
      const imageLesbians = resLesbians[Math.floor(resLesbians.length * Math.random())];
      conn.sendMessage(m.chat, { image: { url: imageLesbians }, caption: `_${command}_`.trim(), buttons: [{ buttonId: `${command}`, buttonText: { displayText: 'Siguiente' }, type: 1 }], footer: 'Presiona el botón para ver otra imagen.' }, { quoted: m });
      break;
    case 'panties':
      await sendNsfwImage(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/panties.json`, command);
      break;
    case 'pene':
      conn.sendMessage(m.chat, { image: { url: `${global.MyApiRestBaseUrl}/api/adult/pene?apikey=${global.MyApiRestApikey}` }, caption: `_${command}_`.trim(), buttons: [{ buttonId: `${command}`, buttonText: { displayText: 'Siguiente' }, type: 1 }], footer: 'Presiona el botón para ver otra imagen.' }, { quoted: m });
      break;
    case 'porno':
      await sendNsfwImage(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/porno.json`, command);
      break;
    case 'randomxxx':
      const randomJsons = ['https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/tetas.json', 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/booty.json', 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/imagenlesbians.json', 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/panties.json', 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/porno.json'];
      const randomUrl = randomJsons[Math.floor(randomJsons.length * Math.random())];
      await sendNsfwImage(randomUrl, command);
      break;
    case 'pechos':
      await sendNsfwImage(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/pechos.json`, command);
      break;
    case 'yaoi':
      const resYaoi = await fetch(`https://nekobot.xyz/api/image?type=yaoi`);
      const jsonYaoi = await resYaoi.json();
      conn.sendMessage(m.chat, { image: { url: jsonYaoi.message }, caption: `_${command}_`.trim(), buttons: [{ buttonId: `${command}`, buttonText: { displayText: 'Siguiente' }, type: 1 }], footer: 'Presiona el botón para ver otra imagen.' }, { quoted: m });
      break;
    case 'yaoi2':
      const resYaoi2 = await fetch(`https://purrbot.site/api/img/nsfw/yaoi/g`);
      const jsonYaoi2 = await resYaoi2.json();
      conn.sendMessage(m.chat, { image: { url: jsonYaoi2.url }, caption: `_${command}_`.trim(), buttons: [{ buttonId: `${command}`, buttonText: { displayText: 'Siguiente' }, type: 1 }], footer: 'Presiona el botón para ver otra imagen.' }, { quoted: m });
      break;
    default:
      conn.sendMessage(m.chat, { text: 'Comando no reconocido.' }, { quoted: m });
  }
};

export default handler;
