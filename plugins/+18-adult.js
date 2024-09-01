import axios from 'axios';
import fetch from 'node-fetch';

const handler = async (m, { command, conn }) => {
  // Verifica si el modo horny está habilitado para el chat
  if (!db.data.chats[m.chat].modohorny && m.isGroup) throw 'Este comando no está permitido en este grupo.';

  // Función para enviar una imagen con un comando específico
  const sendImage = async (url, command) => {
    try {
      const res = (await axios.get(url)).data;
      const imageUrl = res[Math.floor(res.length * Math.random())];
      conn.sendMessage(m.chat, { image: { url: imageUrl }, caption: `_${command}_`.trim() }, { quoted: m });
    } catch (error) {
      console.error('Error al obtener la imagen:', error.message);
      conn.sendMessage(m.chat, { text: 'Error al obtener la imagen. Intenta de nuevo más tarde.' }, { quoted: m });
    }
  };

  // Procesa el comando
  switch (command) {
    case 'nsfwloli':
      await sendImage('https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwloli.json', command);
      break;
    case 'nsfwfoot':
      await sendImage('https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwfoot.json', command);
      break;
    case 'nsfwass':
      await sendImage('https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwass.json', command);
      break;
    case 'nsfwbdsm':
      await sendImage('https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwbdsm.json', command);
      break;
    case 'nsfwcum':
      conn.sendMessage(m.chat, { image: { url: `${global.MyApiRestBaseUrl}/api/nsfw/nsfwcum&apikey=${global.MyApiRestApikey}` }, caption: `_${command}_`.trim() }, { quoted: m });
      break;
    case 'nsfwero':
      await sendImage('https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwero.json', command);
      break;
    case 'nsfwfemdom':
      await sendImage('https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwfemdom.json', command);
      break;
    case 'nsfwglass':
      await sendImage('https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwglass.json', command);
      break;
    case 'nsfworgy':
      await sendImage('https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfworgy.json', command);
      break;
    case 'tetas':
      try {
        const resError = (await axios.get('https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/tetas.json')).data;
        let res = (await fetch('https://api-fgmods.ddns.net/api/nsfw/boobs?apikey=fg-dylux')).json();
        if (!res || res === '') res = resError[Math.floor(resError.length * Math.random())];
        conn.sendMessage(m.chat, { image: { url: res }, caption: `_${command}_`.trim() }, { quoted: m });
      } catch (error) {
        console.error('Error al obtener la imagen de tetas:', error.message);
        conn.sendMessage(m.chat, { text: 'Error al obtener la imagen de tetas. Intenta de nuevo más tarde.' }, { quoted: m });
      }
      break;
    case 'booty':
      try {
        const resError = (await axios.get('https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/booty.json')).data;
        let res = (await fetch('https://api-fgmods.ddns.net/api/nsfw/ass?apikey=fg-dylux')).json();
        if (!res || res === '') res = resError[Math.floor(resError.length * Math.random())];
        conn.sendMessage(m.chat, { image: { url: res }, caption: `_${command}_`.trim() }, { quoted: m });
      } catch (error) {
        console.error('Error al obtener la imagen de booty:', error.message);
        conn.sendMessage(m.chat, { text: 'Error al obtener la imagen de booty. Intenta de nuevo más tarde.' }, { quoted: m });
      }
      break;
    case 'ecchi':
      await sendImage('https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/ecchi.json', command);
      break;
    case 'furro':
      await sendImage('https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/furro.json', command);
      break;
    case 'trapito':
      try {
        const res = await fetch('https://api.waifu.pics/nsfw/trap');
        const json = await res.json();
        conn.sendMessage(m.chat, { image: { url: json.url }, caption: `_${command}_`.trim() }, { quoted: m });
      } catch (error) {
        console.error('Error al obtener la imagen de trapito:', error.message);
        conn.sendMessage(m.chat, { text: 'Error al obtener la imagen de trapito. Intenta de nuevo más tarde.' }, { quoted: m });
      }
      break;
    case 'imagenlesbians':
      try {
        const resError = (await axios.get('https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/imagenlesbians.json')).data;
        let res = (await fetch('https://api-fgmods.ddns.net/api/nsfw/lesbian?apikey=fg-dylux')).json();
        if (!res || res === '') res = resError[Math.floor(resError.length * Math.random())];
        conn.sendMessage(m.chat, { image: { url: res }, caption: `_${command}_`.trim() }, { quoted: m });
      } catch (error) {
        console.error('Error al obtener la imagen de lesbianas:', error.message);
        conn.sendMessage(m.chat, { text: 'Error al obtener la imagen de lesbianas. Intenta de nuevo más tarde.' }, { quoted: m });
      }
      break;
    case 'panties':
      await sendImage('https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/panties.json', command);
      break;
    case 'pene':
      conn.sendMessage(m.chat, { image: { url: `${global.MyApiRestBaseUrl}/api/adult/pene?apikey=${global.MyApiRestApikey}` }, caption: `_${command}_`.trim() }, { quoted: m });
      break;
    case 'porno':
      await sendImage('https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/porno.json', command);
      break;
    case 'randomxxx':
      try {
        const urls = [
          'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/tetas.json',
          'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/booty.json',
          'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/imagenlesbians.json',
          'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/panties.json',
          'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/porno.json'
        ];
        const randomUrl = urls[Math.floor(urls.length * Math.random())];
        await sendImage(randomUrl, command);
      } catch (error) {
        console.error('Error al obtener la imagen aleatoria:', error.message);
        conn.sendMessage(m.chat, { text: 'Error al obtener la imagen aleatoria. Intenta de nuevo más tarde.' }, { quoted: m });
      }
      break;
    case 'pechos':
      await sendImage('https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/pechos.json', command);
      break;
    case 'yaoi':
      try {
        const res = await fetch('https://nekobot.xyz/api/image?type=yaoi');
        const json = await res.json();
        conn.sendMessage(m.chat, { image: { url: json.message }, caption: `_${command}_`.trim() }, { quoted: m });
      } catch (error) {
        console.error('Error al obtener la imagen de yaoi:', error.message);
        conn.sendMessage(m.chat, { text: 'Error al obtener la imagen de yaoi. Intenta de nuevo más tarde.' }, { quoted: m });
      }
      break;
    case 'yaoi2':
      try {
        const res = await fetch('https://purrbot.site/api/img/nsfw/yaoi/gif');
        const json = await res.json();
        conn.sendMessage(m.chat, { image: { url: json.link }, caption: `_${command}_`.trim() }, { quoted: m });
      } catch (error) {
        console.error('Error al obtener la imagen de yaoi2:', error.message);
        conn.sendMessage(m.chat, { text: 'Error al obtener la imagen de yaoi2. Intenta de nuevo más tarde.' }, { quoted: m });
      }
      break;
    case 'yuri':
      await sendImage('https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/yuri.json', command);
      break;
    case 'yuri2':
      try {
        const resError = (await axios.get('https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/yuri.json')).data;
        const res = await fetch('https://purrbot.site/api/img/nsfw/yuri/gif');
        const json = await res.json();
        let url = json.link;
        if (!url || url === '') url = resError[Math.floor(resError.length * Math.random())];
        conn.sendMessage(m.chat, { image: { url: url }, caption: `_${command}_`.trim() }, { quoted: m });
      } catch (error) {
        console.error('Error al obtener la imagen de yuri2:', error.message);
        conn.sendMessage(m.chat, { text: 'Error al obtener la imagen de yuri2. Intenta de nuevo más tarde.' }, { quoted: m });
      }
      break;
    default:
      conn.sendMessage(m.chat, { text: 'Comando no reconocido.' }, { quoted: m });
      break;
  }
};

handler.help = ['nsfwloli', 'nsfwfoot', 'nsfwass', 'nsfwbdsm', 'nsfwcum', 'nsfwero', 'nsfwfemdom', 'nsfwfoot', 'nsfwglass', 'nsfworgy', 'yuri', 'yuri2', 'yaoi', 'yaoi2', 'panties', 'tetas', 'booty', 'ecchi', 'furro', 'trapito', 'imagenlesbians', 'pene', 'porno', 'randomxxx', 'pechos'];
handler.command = ['nsfwloli', 'nsfwfoot', 'nsfwass', 'nsfwbdsm', 'nsfwcum', 'nsfwero', 'nsfwfemdom', 'nsfwfoot', 'nsfwglass', 'nsfworgy', 'yuri', 'yuri2', 'yaoi', 'yaoi2', 'panties', 'tetas', 'booty', 'ecchi', 'furro', 'trapito', 'imagenlesbians', 'pene', 'porno', 'randomxxx', 'pechos'];
handler.tags = ['nsfw'];

export default handler;
