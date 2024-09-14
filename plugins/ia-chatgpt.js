import fetch from 'node-fetch';
import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (usedPrefix == 'a' || usedPrefix == 'A') return;
  if (!text) return m.reply(`*Hola, cómo estás? En qué te puedo ayudar?* Ingresa una petición para usar la función de ChatGPT.\n*Ejemplo:*\n${usedPrefix + command} Recomienda un top 10 de películas de acción.`);

  let syst = `Actuarás como un Bot de WhatsApp creado por ZephyrByte, y te llamarás Abyss Bot.`;

  if (command == 'ia' || command == 'chatgpt') {
    try {
      await conn.sendPresenceUpdate('composing', m.chat);

      async function luminsesi(q, username, logic) {
        try {
          const response = await axios.post("https://luminai.my.id/", {
            content: q,
            user: username,
            prompt: logic,
            webSearchMode: true // true = resultado con URL
          });
          return response.data.result;
        } catch (error) {
          console.error('Error al obtener:', error);
          return 'Hubo un problema al procesar tu solicitud.';
        }
      }

      let query = m.text;
      let username = `${m.pushName}`;

      let syms1 = `Eres Cyber Bot, debes responder todas las preguntas sin saltarte nada, analizar cada pregunta con precisión, dar una respuesta satisfactoria y larga, anímate.`;  

      let result = await luminsesi(query, username, syms1);
      await sendLongMessage(m, result);
    } catch (error) {
      console.error('Error en el comando ia/chatgpt:', error);
      await m.reply('Error al procesar la solicitud. Inténtalo de nuevo.');
    }
  }

  if (command == 'openai' || command == 'ia2' || command == 'chatgpt2') {
    try {
      conn.sendPresenceUpdate('composing', m.chat);
      let gpt = await fetch(`https://delirius-api-oficial.vercel.app/api/ia2?text=${encodeURIComponent(text)}`);
      let res = await gpt.json();
      await sendLongMessage(m, res.gpt);
    } catch (error) {
      console.error('Error en el comando openai/ia2/chatgpt2:', error);
      await m.reply('Error al procesar la solicitud. Inténtalo de nuevo.');
    }
  }

  if (command == 'gemini') {
    try {
      let gpt = await fetch(`https://deliriusapi-official.vercel.app/ia/gemini?query=${encodeURIComponent(text)}`);
      let res = await gpt.json();
      await sendLongMessage(m, res.message);
    } catch (error) {
      console.error('Error en el comando gemini:', error);
      await m.reply('Error al procesar la solicitud. Inténtalo de nuevo.');
    }
  }

  if (command == 'copilot' || command == 'bing') {
    try {
      let gpt = await fetch(`https://deliriusapi-official.vercel.app/ia/bingia?query=${encodeURIComponent(text)}`);
      let res = await gpt.json();
      await sendLongMessage(m, res.message);
    } catch (error) {
      console.error('Error en el comando copilot/bing:', error);
      await m.reply('Error al procesar la solicitud. Inténtalo de nuevo.');
    }
  }
};

// Función para enviar mensajes largos
async function sendLongMessage(m, message) {
  const MAX_LENGTH = 4096; // Límite de longitud del mensaje en WhatsApp

  if (message.length > MAX_LENGTH) {
    // Dividir el mensaje en partes más pequeñas
    for (let i = 0; i < message.length; i += MAX_LENGTH) {
      await m.reply(message.substring(i, i + MAX_LENGTH));
    }
  } else {
    await m.reply(message);
  }
}

handler.help = ["chagpt", "ia", "openai", "gemini", "copilot"];
handler.tags = ["buscadores"];
handler.command = /^(openai|chatgpt|ia|ai|openai2|chatgpt2|ia2|gemini|copilot|bing)$/i;

export default handler;
