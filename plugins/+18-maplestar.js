const { proto, generateWAMessageFromContent } = (await import("@whiskeysockets/baileys")).default;
import fs from 'fs';

let handler = async (message, { conn }) => {
    const imagePath = './media/abyss.png'; // Ruta de la imagen

    try {
        const imageBuffer = fs.readFileSync(imagePath);
        const buttonMessage = {
            caption: "Click en la imagen para ver el video.",
            footer: "Video Link",
            image: imageBuffer,
            buttons: [
                {
                    buttonId: 'link',
                    buttonText: { displayText: 'Ver Video' },
                    type: 1
                }
            ],
            headerType: 4,
            buttonUrl: 'https://qu.ax/scZw.mp4'
        };

        const messageToSend = generateWAMessageFromContent(message.chat, proto.Message.fromObject({
            buttonsMessage: proto.Message.ButtonsMessage.fromObject(buttonMessage)
        }), { quoted: message });

        await conn.relayMessage(message.chat, messageToSend.message, { messageId: messageToSend.key.id });
    } catch (error) {
        await conn.sendMessage(message.chat, { text: `Error: ${error.message}` }, { quoted: message });
    }
};

handler.help = ['getvideo'];
handler.tags = ['utility'];
handler.command = /^(getvideo)$/i;
export default handler;
