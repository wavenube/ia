const fs = require('fs');

const handler = async (m, { conn }) => {
    const imagePath = './media/Screenshot_20240918_073744.jpg'; // Ruta de la imagen

    // Verificar si el archivo existe
    if (!fs.existsSync(imagePath)) {
        return conn.reply(m.chat, 'Lo siento, no pude encontrar la imagen.', m);
    }

    // Enviar la imagen
    await conn.sendMessage(m.chat, { image: { url: imagePath }, caption: 'Aquí está la imagen solicitada.' }, { quoted: m });
};

handler.help = ['clases']; // Añadir a la lista de comandos de ayuda
handler.tags = ['tools'];  // Categoría del comando
handler.command = /^(clases)$/i; // Comando regex

module.exports = handler; // Exportar el módulo correctamente
