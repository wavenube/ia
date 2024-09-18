const fs = require('fs');

let handler = async (m, { conn }) => {
    // Ruta de la imagen
    const imagePath = './media/Screenshot_20240918_073744.jpg'; 

    // Verificar si el archivo existe
    if (!fs.existsSync(imagePath)) {
        return conn.reply(m.chat, 'No encontré la imagen.', m);
    }

    // Enviar la imagen
    await conn.sendMessage(m.chat, { image: { url: imagePath }, caption: 'Aquí está la imagen de tus clases.' }, { quoted: m });
};

// Definición de ayuda, etiquetas y el patrón del comando
handler.help = ['clases'];
handler.tags = ['tools'];
handler.command = /^\.clases$/i;  // Ajuste aquí: el comando debe ser .clases

module.exports = handler;
