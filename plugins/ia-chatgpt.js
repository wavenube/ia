import fetch from 'node-fetch';
import axios from 'axios';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({ organization: global.openai_org_id, apiKey: global.openai_key });
const openaiii = new OpenAIApi(configuration);

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (usedPrefix === 'a' || usedPrefix === 'A') return;
  if (!text) throw `¡Por favor proporciona un texto para procesar! Usa ${usedPrefix + command} seguido del texto.`;

  try {
    conn.sendPresenceUpdate('composing', m.chat);

    // Definir un mensaje de sistema simple
    const sistema1 = "Eres un asistente útil. Responde de manera útil y coherente.";

    async function getOpenAIChatCompletion(texto) {
      const openaiAPIKey = global.openai_key;
      let chgptdb = global.chatgpt.data.users[m.sender] || [];
      chgptdb.push({ role: 'user', content: texto });
      const url = "https://api.openai.com/v1/chat/completions";
      const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${openaiAPIKey}` };
      const data = { "model": "gpt-3.5-turbo", "messages": [{ "role": "system", "content": sistema1 }, ...chgptdb] };
      const response = await fetch(url, { method: "POST", headers: headers, body: JSON.stringify(data) });

      // Verificar si la respuesta fue exitosa
      if (!response.ok) throw new Error(`Error en la respuesta de OpenAI: ${response.statusText}`);

      const result = await response.json();
      const finalResponse = result.choices[0]?.message?.content;
      if (!finalResponse) throw new Error('Respuesta vacía de OpenAI.');

      return finalResponse;
    }

    let respuesta = await getOpenAIChatCompletion(text);
    if (respuesta === 'error' || respuesta === '' || !respuesta) throw new Error('Respuesta de OpenAI no válida.');

    m.reply(`${respuesta}`.trim());
  } catch (error) {
    console.error('Error en la solicitud OpenAI:', error.message);
    try {
      conn.sendPresenceUpdate('composing', m.chat);
      const botIA222 = await openaiii.createCompletion({ model: 'text-davinci-003', prompt: text, temperature: 0.3, max_tokens: 4097, stop: ['Ai:', 'Human:'], top_p: 1, frequency_penalty: 0.2, presence_penalty: 0 });
      const responseText = botIA222.data.choices[0]?.text;
      if (responseText === 'error' || responseText === '' || !responseText) throw new Error('Respuesta de OpenAI2 no válida.');

      m.reply(responseText.trim());
    } catch (error) {
      console.error('Error en la solicitud OpenAI2:', error.message);
      try {
        conn.sendPresenceUpdate('composing', m.chat);
        const syms1 = "Eres un asistente útil. Responde de manera útil y coherente.";
        const Empireapi1 = await fetch(`${global.MyApiRestBaseUrl}/api/chatgpt?text=${encodeURIComponent(text)}&name=${encodeURIComponent(m.name)}&prompt=${encodeURIComponent(syms1)}&apikey=${global.MyApiRestApikey}`);
        if (!Empireapi1.ok) throw new Error(`Error en la respuesta del API Rest: ${Empireapi1.statusText}`);

        const empireApijson1 = await Empireapi1.json();
        const resultado = empireApijson1.resultado;
        if (resultado === 'error' || resultado === '' || !resultado) throw new Error('Respuesta del API Rest no válida.');

        m.reply(`${resultado}`.trim());
      } catch (error) {
        console.error('Error en la solicitud del API Rest:', error.message);
        throw 'Hubo un problema al procesar tu solicitud.';
      }
    }
  }
};

handler.command = /^(openai|chatgpt|ia|robot|openai2|chatgpt2|ia2|robot2|Mystic|MysticBot)$/i;
export default handler;
