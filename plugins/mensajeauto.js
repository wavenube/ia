import OpenAI from 'openai';
import { translateText } from './translator.js'; // Asumiendo que tienes un módulo de traducción

const openai = new OpenAI({
  apiKey: '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'
});

const handler = async (m, { conn }) => {
  try {
    // Verificar si el mensaje es para el bot
    if (!m.text) return;

    // Obtener el mensaje original
    const originalMessage = m.text;

    // Traducir el mensaje al inglés para la API (opcional)
    const translatedMessage = await translateText(originalMessage, 'en');

    // Generar una respuesta usando OpenAI
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system", 
          content: `Eres un asistente de WhatsApp que responde mensajes de manera natural y casual. 
          Mantén tus respuestas concisas, como si fueras un amigo respondiendo un mensaje. 
          No reveles que eres un bot de IA. Usa un tono informal y amigable.`
        },
        {
          role: "user", 
          content: translatedMessage
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    // Obtener la respuesta generada
    const generatedResponse = aiResponse.choices[0].message.content;

    // Traducir la respuesta de vuelta al español
    const finalResponse = await translateText(generatedResponse, 'es');

    // Enviar la respuesta
    await conn.sendMessage(m.chat, { 
      text: finalResponse 
    }, { quoted: m });

  } catch (error) {
    console.error('Error en la generación de respuesta:', error);
    
    // Respuesta de respaldo si falla la API
    const fallbackResponses = [
      "Lo siento, estoy un poco ocupado ahora.",
      "No entendí bien, ¿podrías repetirlo?",
      "Estoy procesando tu mensaje...",
      "Ups, dame un momento."
    ];
    
    const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    await conn.sendMessage(m.chat, { 
      text: randomFallback 
    }, { quoted: m });
  }
};

// Módulo de traducción (ejemplo simplificado)
const translateText = async (text, targetLang) => {
  try {
    // Aquí podrías usar servicios como Google Translate, DeepL, etc.
    // Este es un ejemplo simplificado
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`, {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        target: targetLang
      })
    });
    
    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Error en traducción:', error);
    return text; // Devolver texto original si falla la traducción
  }
};

handler.command = /^(responder|reply)$/i;
handler.help = ['responder'];
handler.tags = ['ai'];

export default handler;
