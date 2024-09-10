import axios from 'axios';

let handler = async (m, { text }) => {
  const apiKey = '6095d5817e0045b798996bc22aa54bc4'; // Asegúrate de colocar tu API Key aquí.
  if (!text) return m.reply('Por favor ingresa un tema para buscar noticias.');

  await m.reply('Buscando noticias...');

  try {
    let res = await axios.get(`https://newsapi.org/v2/everything?q=${encodeURIComponent(text)}&sortBy=publishedAt&apiKey=${apiKey}`);
    const articles = res.data.articles;

    if (articles.length === 0) {
      return m.reply('No se encontraron noticias sobre ese tema.');
    }

    let newsList = articles.slice(0, 5).map((article, i) => {
      return `*${i + 1}. ${article.title}*\n_${article.source.name}_\n${article.url}`;
    }).join('\n\n');

    await m.reply(`Noticias sobre *${text}*:\n\n${newsList}`);
  } catch (error) {
    console.error(error);
    await m.reply('Ocurrió un error al obtener las noticias.');
  }
};

handler.command = /^(noticias|news)$/i;
export default handler;
