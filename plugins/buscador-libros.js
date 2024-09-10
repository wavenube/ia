import axios from 'axios';

let handler = async (m, { text }) => {
  if (!text) return m.reply('Por favor ingresa el título, autor o ISBN del libro que deseas buscar.');

  await m.reply('Buscando libros...');

  try {
    let res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(text)}&key=893689092587`); // Asegúrate de colocar tu API Key de Google Books aquí.
    const books = res.data.items;

    if (!books || books.length === 0) {
      return m.reply('No se encontraron libros con esa descripción.');
    }

    let bookList = books.slice(0, 5).map((book, i) => {
      const volumeInfo = book.volumeInfo;
      const title = volumeInfo.title || 'Título no disponible';
      const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Autor no disponible';
      const description = volumeInfo.description ? volumeInfo.description.slice(0, 200) + '...' : 'Descripción no disponible';
      const link = volumeInfo.infoLink || 'Enlace no disponible';
      const availability = volumeInfo.accessInfo && volumeInfo.accessInfo.epub.isAvailable ? 'Disponible en formato ePub' : 'No disponible en ePub';
      
      return `*${i + 1}. ${title}*\nAutor(es): ${authors}\nDescripción: ${description}\nDisponibilidad: ${availability}\n${link}`;
    }).join('\n\n');

    await m.reply(`Resultados de búsqueda:\n\n${bookList}`);
  } catch (error) {
    console.error(error);
    await m.reply('Ocurrió un error al obtener la información del libro.');
  }
};

handler.command = /^(libro|libros|buscarlibro|booksearch)$/i;
export default handler;
