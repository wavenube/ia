import axios from 'axios';
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import("baileys")).default;

let handler = async (message, { conn, text }) => {
    if (!text) return conn.sendMessage(message.chat, { text: "[❗] ¿Qué quieres buscar en Pinterest?" }, { quoted: message });

    try {
        let searchResults = await pinterestSearch(text);
        if (searchResults.length === 0) throw new Error("No se encontraron imágenes.");

        let shuffledResults = shuffleArray(searchResults).slice(0, 5);
        let carouselItems = await Promise.all(shuffledResults.map(async (url, index) => {
            let imageMessage = await createImageMessage(url, conn);
            return {
                body: proto.Message.InteractiveMessage.Body.fromObject({ text: `Imagen - ${index + 1}` }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: "🔎 Pinterest Search" }),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: '',
                    hasMediaAttachment: true,
                    imageMessage: imageMessage
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: [{
                        name: "cta_url",
                        buttonParamsJson: `{\"display_text\":\"Ver en Pinterest 📫\",\"Url\":\"https://www.pinterest.com/search/pins/?q=${encodeURIComponent(text)}\",\"merchant_url\":\"https://www.pinterest.com/search/pins/?q=${encodeURIComponent(text)}\"}`
                    }]
                })
            };
        }));

        const responseMessage = generateWAMessageFromContent(message.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.create({ text: `[❗] Resultado de: ${text}` }),
                        footer: proto.Message.InteractiveMessage.Footer.create({ text: "🔎 `P I N T E R E S T - S E A R C H`" }),
                        header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards: carouselItems })
                    })
                }
            }
        }, { quoted: message });

        await conn.relayMessage(message.chat, responseMessage.message, { messageId: responseMessage.key.id });

    } catch (error) {
        await conn.sendMessage(message.chat, { text: error.message }, { quoted: message });
    }
};

handler.help = ["pinterest"];
handler.tags = ["downloader"];
handler.command = /^(pinterest)$/i;
export default handler;

async function pinterestSearch(query) {
    try {
        const response = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${encodeURIComponent(query)}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${encodeURIComponent(query)}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D`);
        const results = response.data.resource_response.data.results.map(result => result.images.orig.url);
        return results;
    } catch (error) {
        throw new Error("Error en la búsqueda de Pinterest.");
    }
}

async function createImageMessage(url, conn) {
    const { imageMessage } = await generateWAMessageContent({ image: { url } }, { upload: conn.waUploadToServer });
    return imageMessage;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
