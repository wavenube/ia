import axios from 'axios';
const { proto, generateWAMessageFromContent, generateWAMessageContent } = (await import("@whiskeysockets/baileys")).default;

// Define tus enlaces de video aquí
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
        shuffleArray(VIDEO_URLS);
        let selectedVideos = VIDEO_URLS.slice(0, 7);
        let videoMessages = await Promise.all(selectedVideos.map(url => createVideoMessage(url, conn)));
        let results = videoMessages.map((videoMessage, index) => ({
            body: proto.Message.InteractiveMessage.Body.fromObject({ text: '' }),
            footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: `*❧ By ${global.wm}*` }),
            header: proto.Message.InteractiveMessage.Header.fromObject({
                title: `Video ${index + 1}`,
                hasMediaAttachment: true,
                videoMessage: videoMessage
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: [] })
        }));
        const responseMessage = generateWAMessageFromContent(message.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.create({ text: `*< VIDEO SELECTION >*\n\n📈 *Resultados obtenidos:*` }),
                        footer: proto.Message.InteractiveMessage.Footer.create({ text: '' }),
                        header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards: results })
                    })
                }
            }
        }, { quoted: message });
        await conn.relayMessage(message.chat, responseMessage.message, { messageId: responseMessage.key.id });
    } catch (error) {
        await conn.sendMessage(message.chat, { text: error.toString() }, { quoted: message });
    }
};
handler.help = ['videos'];
handler.tags = ['general'];
handler.command = /^(videos)$/i;
export default handler;

async function createVideoMessage(url, conn) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const buffer = response.data;
        const { videoMessage } = await generateWAMessageContent({ video: buffer }, { upload: conn.waUploadToServer });
        return videoMessage;
    } catch (error) {
        throw new Error(`Error al crear el mensaje de video: ${error.message}`);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
