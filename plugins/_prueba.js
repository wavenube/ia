
import { Storage } from 'megajs';
import fs from 'fs';

const handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, 'Por favor, proporciona una URL válida de MEGA.', m);

  try {
    // Crear la instancia de almacenamiento de MEGA con el enlace del archivo
    const file = Storage.fromURL(text);

    // Extrae el nombre del archivo
    const filename = file.name;

    // Descarga el archivo a un buffer
    file.loadAttributes((err) => {
      if (err) throw err;

      const fileStream = file.download();
      const writeStream = fs.createWriteStream(`/tmp/${filename}`);

      fileStream.pipe(writeStream);

      writeStream.on('finish', () => {
        // Una vez descargado, envía el archivo al chat
        conn.sendMessage(m.chat, { document: fs.readFileSync(`/tmp/${filename}`), fileName: filename }, { quoted: m });
        fs.unlinkSync(`/tmp/${filename}`); // Eliminar el archivo temporal después de enviar
      });

      writeStream.on('error', (err) => {
        throw new Error('Error al escribir el archivo en el sistema: ' + err.message);
      });
    });
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, `Error al descargar el archivo: ${error.message}`, m);
  }
};

handler.help = ['mega <url>'];
handler.tags = ['tools'];
handler.command = /^mega$/i;

export default handler;
