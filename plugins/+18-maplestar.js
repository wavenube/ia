const { default: makeWASocket, proto, generateWAMessageFromContent } = await import('@whiskeysockets/baileys');
import fs from 'fs';

let handler = async (message, { conn }) => {
    const imagePath = './media/abyss.png'; // Ruta de la imagen

    try {
        const imageBuffer = fs.readFileSync(imagePath);

        const messageContent = generateWAMessageFromContent(
            message.chat,
            proto.Message.fromObject({
                imageMessage: {
                    url: 'https://qu.ax/scZw.mp4', // El enlace al que redirigirá
                    caption: "Click en la imagen para ver el video.",
                    jpegThumbnail: imageBuffer,
                    contextInfo: {
                        externalAdReply: {
                            title: "Haz click aquí para ver el video",
                            body: "Video disponible",
                            mediaType: 2,
                            thumbnail: imageBuffer,
                            mediaUrl: 'https://qu.ax/scZw.mp4',
                            sourceUrl: 'https://qu.ax/scZw.mp4'
                        }
                    }
                }
            }),
            {}
        );

        await conn.relayMessage(message.chat, messageContent.message, { messageId: messageContent.key.id });
    } catch (error) {
        await conn.sendMessage(message.chat, { text: `Error: ${error.message}` }, { quoted: message });
    }
};

handler.help = ['getvideo'];
handler.tags = ['utility'];
handler.command = /^(getvideo)$/i;
export default handler;
