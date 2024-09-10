import fetch from 'node-fetch';

const handler = async (m, { args, usedPrefix, command }) => {
  // Mensaje por defecto si no se pasan argumentos
  const msg = `Uso correcto: ${usedPrefix + command} <idioma> <texto>\nEjemplo: ${usedPrefix + command} en Hola\nMás info: https://cloud.google.com/translate/docs/languages`;
  if (!args || !args[0]) return m.reply(msg);

  let lang = args[0];
  let text = args.slice(1).join(' ');
  const defaultLang = 'es'; // Idioma por defecto

  // Si el primer argumento no tiene longitud 2, usa el idioma por defecto
  if ((args[0] || '').length !== 2) {
    lang = defaultLang;
    text = args.join(' ');
  }

  // Si no hay texto y se está respondiendo a un mensaje, usa el texto citado
  if (!text && m.quoted && m.quoted.text) text = m.quoted.text;

  try {
    // Intenta la primera API
    const result = await fetch(`https://api.lolhuman.xyz/api/translate/auto/${lang}?apikey=${lolkeysapi}&text=${text}`);
    const data = await result.json();
    const translatedText = data.result.translated;
    await m.reply(`Texto traducido: ${translatedText}`);
  } catch (error) {
    await m.reply('Error al traducir el texto. Verifica que el idioma sea correcto.');
  }
};

handler.command = /^(translate|traducir|trad)$/i;

export default handler;
