import uploadImage from '../lib/uploadImage.js';
import fetch from 'node-fetch';
import axios from 'axios';
import Jimp from 'jimp';
import FormData from 'form-data';

const handler = async (m, {conn, text, args, usedPrefix, command}) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || q.mediaType || '';
  
  // Verifica si el mensaje contiene una imagen
  if (!/image/g.test(mime)) throw "*Este comando solo se puede usar con imágenes.*";
  
  // Envía un mensaje de procesamiento
  m.reply("*Procesando tu imagen...*");
  
  // Descarga la imagen
  const data = await q.download?.();
  
  // Sube la imagen a un servicio de alojamiento y obtiene la URL
  const image = await uploadImage(data);
  
  try {
    // Intenta convertir la imagen a anime usando el primer método
    const img = await conn.getFile(image);  
    const tuanime = await toanime(img.data);
    await conn.sendFile(m.chat, tuanime.image_data, 'toanime.jpg', null, m);
  } catch (e) {
    try {
      // Segundo intento usando otra API
      const anime = await fetch(`https://deliriusapi-official.vercel.app/api/toanime?url=${image}`);
      const json = await anime.json();  
      await conn.sendFile(m.chat, json.data.convert, 'toanime.jpg', null, m);
    } catch {      
      try {
        // Tercer intento usando otra API
        const anime = `https://api.lolhuman.xyz/api/imagetoanime?apikey=${lolkeysapi}&img=${image}`;
        await conn.sendFile(m.chat, anime, 'toanime.jpg', null, m);
      } catch {
        try {
          // Cuarto intento usando otra API
          const anime2 = `https://api.zahwazein.xyz/photoeditor/jadianime?url=${image}&apikey=${keysxxx}`;
          await conn.sendFile(m.chat, anime2, 'toanime.jpg', null, m);
        } catch {
          try {
            // Quinto intento usando otra API
            const anime3 = `https://api.caliph.biz.id/api/animeai?img=${image}&apikey=caliphkey`;
            await conn.sendFile(m.chat, anime3, 'toanime.jpg', null, m);
          } catch {
            // Si todos los intentos fallan, lanza un error
            throw "*Error al convertir la imagen a anime.*";
          }
        }
      }
    }
  }
};

handler.help = ["toanime"];
handler.tags = ["tools"];
handler.command = /^(jadianime|toanime)$/i;
export default handler;

async function toanime(input) {
  try {
    const baseUrl = 'https://tools.betabotz.eu.org';  
    const image = await Jimp.read(input);
    const buffer = await new Promise((resolve, reject) => {
      image.getBuffer(Jimp.MIME_JPEG, (err, buf) => {
        if (err) {
          reject('Error al procesar la imagen.');
        } else {
          resolve(buf);
        }
      });
    });
    const form = new FormData();
    form.append('image', buffer, { filename: 'toanime.jpg' });
    const { data } = await axios.post(`${baseUrl}/ai/toanime`, form, {
      headers: {
        ...form.getHeaders(),
        'accept': 'application/json',
      },
    });
    const res = {
      image_data: data.result,
      image_size: data.size
    };
    return res;
  } catch (error) {
    console.error('Error al convertir la imagen a anime:', error);
    return 'Error al convertir la imagen a anime.';
  }
}

async function jadianime(image) {
    return new Promise(async(resolve, reject) => {
        const requestId = Math.random().toString(36).substring(7); 
        const userAgent = getRandomUserAgent();
        const ipAddress = generateRandomIP();
        axios("https://www.drawever.com/api/photo-to-anime", {
            headers: {
                "content-type": "application/json",
                "X-Request-ID": requestId,
                "user-agent": userAgent,
                "X-Forwarded-For": ipAddress,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Referer": "https://www.drawever.com/process",
                "Sec-Ch-Ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": "\"Windows\"",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "same-origin",
                "Upgrade-Insecure-Requests": "1",
            },
            "data": { "data": "data:image/jpeg;base64," + image.toString('base64') },
            "method": "POST"
        }).then(res => { 
            let yanz = res.data
            resolve(yanz)
        }).catch(err => {
            reject(err)
        });
    });
}

function getRandomUserAgent() {
    const userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36"
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

function generateRandomIP() {
    const octet = () => Math.floor(Math.random() * 256);
    return `${octet()}.${octet()}.${octet()}.${octet()}`;
}
