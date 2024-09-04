const { default: makeWASocket, proto, generateWAMessageFromContent } = await import('@whiskeysockets/baileys');
import fs from 'fs';

let handler = async (message, { conn }) => {
    const imagePath = './media/abyss.png'; // Ruta de la imagen

    try {
        const imageBuffer = fs.readFileSync(imagePath);

        const buttonMessage = {
            image: { url: imagePath },
            caption: "Click en la imagen para ver el video.",
            footer: "Video Link",
            templateButtons: [
                {
                    index: 1,
                    urlButton: {
                        displayText: 'Ver Video',
                        url: 'https://qu.ax/scZw.mp4'
                    }
                }
            ]
        };

        await conn.sendMessage(message.chat, buttonMessage, { quoted: message });
    } catch (error) {
        await conn.sendMessage(message.chat, { text: `Error: ${error.message}` }, { quoted: message });
    }
};

handler.help = ['getvideo'];
handler.tags = ['utility'];
handler.command = /^(getvideo)$/i;
export default handler;
