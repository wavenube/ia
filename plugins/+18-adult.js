import axios from 'axios';
import fetch from 'node-fetch';

const handler = async (m, { command, conn }) => {

  if (!db.data.chats[m.chat].modohorny && m.isGroup) throw 'Este comando no está permitido en este grupo.';

  const sendNsfwImage = async (url, command) => {
    const res = (await axios.get(url)).data;
    const imageUrl = res[Math.floor(res.length * Math.random())];
    conn.sendMessage(m.chat, { image: { url: imageUrl }, caption: `_${command}_`.trim() }, { quoted: m });
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
      conn.sendMessage(m.chat, { image: { url: `${global.MyApiRestBaseUrl}/api/nsfw/nsfwcum&apikey=${global.MyApiRestApikey}` }, caption: `_${command}_`.trim() }, { quoted: m });
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
      conn.sendMessage(m.chat, { image: { url: imageTetas }, caption: `_${command}_`.trim() }, { quoted: m });
      break;
    case 'booty':
      const resBooty = (await axios.get(`https://api-fgmods.ddns.net/api/nsfw/ass?apikey=fg-dylux`)).data || (await axios.get(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/booty.json`)).data;
      const imageBooty = resBooty[Math.floor(resBooty.length * Math.random())];
      conn.sendMessage(m.chat, { image: { url: imageBooty }, caption: `_${command}_`.trim() }, { quoted: m });
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
      conn.sendMessage(m.chat, { image: { url: jsonTrapito.url }, caption: `_${command}_`.trim() }, { quoted: m });
      break;
    case 'imagenlesbians':
      const resLesbians = (await axios.get(`https://api-fgmods.ddns.net/api/nsfw/lesbian?apikey=fg-dylux`)).data || (await axios.get(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/imagenlesbians.json`)).data;
      const imageLesbians = resLesbians[Math.floor(resLesbians.length * Math.random())];
      conn.sendMessage(m.chat, { image: { url: imageLesbians }, caption: `_${command}_`.trim() }, { quoted: m });
      break;
    case 'panties':
      await sendNsfwImage(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/panties.json`, command);
      break;
    case 'pene':
      conn.sendMessage(m.chat, { image: { url: `${global.MyApiRestBaseUrl}/api/adult/pene?apikey=${global.MyApiRestApikey}` }, caption: `_${command}_`.trim() }, { quoted: m });
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
      conn.sendMessage(m.chat, { image: { url: jsonYaoi.message }, caption: `_${command}_`.trim() }, { quoted: m });
      break;
    case 'yaoi2':
      const resYaoi2 = await fetch(`https://purrbot.site/api/img/nsfw/yaoi/gif`);
      const jsonYaoi2 = await resYaoi2.json();
      conn.sendMessage(m.chat, { image: { url: jsonYaoi2.link }, caption: `_${command}_`.trim() }, { quoted: m });
      break;
    case 'yuri':
      await sendNsfwImage(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/yuri.json`, command);
      break;
    case 'yuri2':
      const resYuri2 = await fetch(`https://purrbot.site/api/img/nsfw/yuri/gif`);
      const jsonYuri2 = await resYuri2.json();
      const resErrorYuri2 = (await axios.get(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/yuri.json`)).data;
      const imageYuri2 = jsonYuri2.link || resErrorYuri2[Math.floor(resErrorYuri2.length * Math.random())];
      conn.sendMessage(m.chat, { image: { url: imageYuri2 }, caption: `_${command}_`.trim() }, { quoted: m });
      break;
  }
};

handler.help = ['nsfwloli', 'nsfwfoot', 'nsfwass', 'nsfwbdsm', 'nsfwcum', 'nsfwero', 'nsfwfemdom', 'nsfwfoot', 'nsfwglass', 'nsfworgy', 'yuri', 'yuri2', 'yaoi', 'yaoi2', 'panties', 'tetas', 'booty', 'ecchi', 'furro', 'trapito', 'imagenlesbians', 'pene', 'porno', 'randomxxx', 'pechos'];
handler.command = ['nsfwloli', 'nsfwfoot', 'nsfwass', 'nsfwbdsm', 'nsfwcum', 'nsfwero', 'nsfwfemdom', 'nsfwfoot', 'nsfwglass', 'nsfworgy', 'yuri', 'yuri2', 'yaoi', 'yaoi2', 'panties', 'tetas', 'booty', 'ecchi', 'furro', 'trapito', 'imagenlesbians', 'pene', 'porno', 'randomxxx', 'pechos'];
handler.tags = ['nsfw'];
export default handler;
