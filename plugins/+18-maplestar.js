import { proto, generateWAMessageFromContent, generateWAMessageContent } from "@whiskeysockets/baileys";
import axios from 'axios';

// Example video URLs
const VIDEO_URLS = [
    'https://qu.ax/yHMn.mp4',
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
        // Shuffle video URLs and select the first 7
        shuffleArray(VIDEO_URLS);
        let selectedResults = VIDEO_URLS.slice(0, 7);

        // Create video messages for each selected URL
        let videoMessages = await Promise.all(selectedResults.map(url => createVideoMessage(url, conn)));

        // Create carousel cards
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

        // Generate the carousel message
        const responseMessage = generateWAMessageFromContent(message.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.create({ text: `*< VIDEO CAROUSEL >*\n\n📌 *Videos disponibles:*` }),
                        footer: proto.Message.InteractiveMessage.Footer.create({ text: '' }),
                        header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards: results })
                    })
                }
            }
        }, { quoted: message });

        // Send the message
        await conn.relayMessage(message.chat, responseMessage.message, { messageId: responseMessage.key.id });

    } catch (error) {
        await conn.sendMessage(message.chat, { text: `Error: ${error.message}` }, { quoted: message });
    }
};

handler.help = ['videoCarousel'];
handler.tags = ['tools'];
handler.command = /^(videocarousel|carousel)$/i;
export default handler;

// Function to shuffle the array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to create a video message from a URL
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
