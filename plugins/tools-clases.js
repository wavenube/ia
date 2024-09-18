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

handler.command = /^(clases)$/i;
export default handler;
