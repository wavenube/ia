import translate from '@vitalets/google-translate-api';
import fetch from 'node-fetch';

const handler = async (m, { args, usedPrefix, command }) => {
  // Mensaje por defecto si no se pasan argumentos
  const msg = `Uso correcto: ${usedPrefix + command} <idioma> <texto>\nEjemplo: ${usedPrefix + command} en Hola\nMás info: https://cloud.google.com/translate/docs/languages`;
  
  // Verifica si hay argumentos
  if (!args || !args[0]) return m.reply(msg);

  let lang = args[0]; // Primer argumento: el idioma
  let text = args.slice(1).join(' '); // Resto de los argumentos: el texto a traducir
  const defaultLang = 'es'; // Idioma por defecto

  // Si el primer argumento no es un código de 2 letras, usar el idioma por defecto
  if ((args[0] || '').length !== 2) {
    lang = defaultLang;
    text = args.join(' ');
  }

  // Si no hay texto explícito, intenta traducir el texto citado
  if (!text && m.quoted && m.quoted.text) text = m.quoted.text;

  try {
    // Intenta traducir con la API de Google
    const result = await translate(`${text}`, { to: lang, autoCorrect: true });
    await m.reply(`Texto traducido: ${result.text}`);
  } catch {
    try {
      // Intenta traducir con la API de lolhuman si falla Google
      const lol = await fetch(`https://api.lolhuman.xyz/api/translate/auto/${lang}?apikey=${lolkeysapi}&text=${text}`);
      const loll = await lol.json();
      const result2 = loll.result.translated;
      await m.reply(`Texto traducido: ${result2}`);
    } catch {
      // Si todas las traducciones fallan
      await m.reply('Error al traducir el texto. Verifica que el idioma sea correcto.');
    }
  }
};

handler.command = /^(translate|traducir|trad)$/i;

export default handler;
