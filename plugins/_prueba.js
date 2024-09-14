import { File } from 'megajs'; // Importa la clase File para manejar descargas

const handler = async (m, { text, conn }) => {
  if (!text) return conn.reply(m.chat, 'Por favor, proporciona una URL de MEGA válida.', m);

  try {
    // Inicializa el archivo a partir de la URL proporcionada
    const file = File.fromURL(text);

    // Obtén información del archivo (nombre, tamaño, etc.)
    const info = await file.loadAttributes();
    const fileName = info.name;

    // Asegúrate de que se trate de un archivo de video
    const extension = fileName.split('.').pop().toLowerCase();
    let mimeType;

    // Definir el MIME según la extensión
    if (extension === 'mp4') {
      mimeType = 'video/mp4';
    } else if (extension === 'mkv') {
      mimeType = 'video/x-matroska';
    } else if (extension === 'avi') {
      mimeType = 'video/x-msvideo';
    } else {
      mimeType = 'application/octet-stream'; // Genérico si no es un video conocido
    }

    // Descargar el archivo como stream
    const stream = file.download();

    // Convertir el stream a un buffer para enviarlo por WhatsApp
    let chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Enviar el archivo descargado a través de WhatsApp
    await conn.sendMessage(m.chat, { 
      document: buffer, 
      mimetype: mimeType, 
      fileName: fileName 
    }, { quoted: m });
    
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, `Error al descargar el archivo: ${error.message}`, m);
  }
};

handler.help = ['mega'].map(v => v + ' <url>');
handler.tags = ['downloader'];
handler.command = /^(mega)$/i;

export default handler;
