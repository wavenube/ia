import { File } from 'megajs'; // Importa la clase File para manejar descargas

const handler = async (m, { text, conn }) => {
  if (!text) return conn.reply(m.chat, 'Por favor, proporciona una URL de MEGA válida.', m);

  try {
    // Inicializa el archivo a partir de la URL proporcionada
    const file = File.fromURL(text);

    // Obtén información del archivo (nombre, tamaño, etc.)
    const info = await file.loadAttributes();
    const fileName = info.name;

    // Descargar el archivo como stream
    const stream = file.download();

    // Convertir el stream a un buffer para enviarlo por WhatsApp
    let chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Enviar el archivo descargado a través de WhatsApp
    await conn.sendMessage(m.chat, { document: buffer, mimetype: 'application/octet-stream', fileName: fileName }, { quoted: m });
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, `Error al descargar el archivo: ${error.message}`, m);
  }
};

handler.help = ['mega'].map(v => v + ' <url>');
handler.tags = ['downloader'];
handler.command = /^(mega)$/i;

export default handler;
