import axios from 'axios';
const { proto, generateWAMessageFromContent, generateWAMessageContent } = (await import("@whiskeysockets/baileys")).default;

let handler = async (message, { conn, text }) => {
    if (!text) return conn.sendMessage(message.chat, { text: '[❗] ¿Qué quieres buscar?' }, { quoted: message });

    try {
        let selectedResults = VIDEO_URLS.slice(0, 7); // Toma los primeros 7 enlaces
        let imageMessages = await Promise.all(selectedResults.map(async (url) => createImageMessage(url, conn)));
        
        let results = imageMessages.map((imageMessage, index) => ({
            body: proto.Message.InteractiveMessage.Body.fromObject({ text: '' }),
            footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: `*❧ By ${global.wm}*` }),
            header: proto.Message.InteractiveMessage.Header.fromObject({
                title: `Video ${index + 1}`,
                hasMediaAttachment: true,
                imageMessage: imageMessage
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
                        body: proto.Message.InteractiveMessage.Body.create({ text: `*< VIDEO LINKS >*\n\n📌 *Videos seleccionados:*` }),
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

handler.help = ['videocarousel'];
handler.tags = ['media'];
handler.command = /^(videocarousel|vcaro)$/i;
export default handler;

async function createImageMessage(url, conn) {
    try {
        const thumbnailUrl = await getVideoThumbnail(url);
        const response = await axios.get(thumbnailUrl, { responseType: 'arraybuffer' });
        const buffer = response.data;

        const { imageMessage } = await generateWAMessageContent({ image: buffer, caption: `🔗 [Click para ver el video](${url})` }, { upload: conn.waUploadToServer });
        return imageMessage;
    } catch (error) {
        throw new Error(`Error al crear el mensaje de imagen: ${error.message}`);
    }
}

async function getVideoThumbnail(url) {
    // Usa una API o método para extraer el thumbnail del video, o usa un servicio de terceros.
    return `https://img.youtube.com/vi/${extractVideoId(url)}/hqdefault.jpg`; // Ejemplo para YouTube, necesitarás adaptar esto para otros servicios.
}

function extractVideoId(url) {
    // Extrae el ID del video desde la URL para servicios como YouTube.
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return videoIdMatch ? videoIdMatch[1] : null;
}
