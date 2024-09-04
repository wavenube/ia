import axios from 'axios';
const { proto, generateWAMessageFromContent } = (await import("@whiskeysockets/baileys")).default;

const VIDEO_URLS = [
    'https://qu.ax/scZw.mp4',
    'https://qu.ax/sKfw.mp4',
    'https://qu.ax/urcH.mp4',
    'https://qu.ax/PZCF.mp4',
    'https://qu.ax/rvnd.mp4',
    'https://qu.ax/OxHZ.mp4',
    'https://qu.ax/aUXT.mp4',
    'https://qu.ax/wbJN.mp4',
    'https://qu.ax/fJf.mp4',
    'https://qu.ax/bFdc.mp4',
    'https://qu.ax/vHNs.mp4',
    'https://qu.ax/uppk.mp4',
    'https://qu.ax/YnM.mp4',
];

let handler = async (message, { conn }) => {
    try {
        let results = [];
        for (let videoUrl of VIDEO_URLS) {
            const thumbnailUrl = await generateThumbnail(videoUrl); // Genera una miniatura para cada video
            results.push({
                body: proto.Message.InteractiveMessage.Body.fromObject({ text: '' }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: `*❧ By ${global.wm}*` }),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: 'Video Link',
                    hasMediaAttachment: true,
                    documentMessage: {
                        url: videoUrl,
                        mimetype: 'video/mp4',
                        caption: 'Click para ver el video'
                    },
                    imageMessage: {
                        url: thumbnailUrl,
                        caption: 'Click para ver el video'
                    },
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: [] }),
            });
        }
        const responseMessage = generateWAMessageFromContent(message.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.create({ text: `*< VIDEO LINKS >*\n\n` + `📌 *Videos disponibles:*` }),
                        footer: proto.Message.InteractiveMessage.Footer.create({ text: '' }),
                        header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards: results })
                    })
                }
            }
        }, { quoted: message });
        await conn.relayMessage(message.chat, responseMessage.message, { messageId: responseMessage.key.id });
    } catch (error) {
        await conn.sendMessage(message.chat, { text: `Error: ${error.message}` }, { quoted: message });
    }
};

handler.help = ['videolinks'];
handler.tags = ['utility'];
handler.command = /^(videolinks)$/i;
export default handler;

async function generateThumbnail(videoUrl) {
    // Aquí puedes usar alguna API para generar una miniatura del video o retornar un placeholder
    return 'https://via.placeholder.com/150'; // URL de la miniatura
}
 
