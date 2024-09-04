import axios from 'axios';
const { default: makeWASocket, proto, generateWAMessageFromContent } = await import('@whiskeysockets/baileys');

let handler = async (message, { conn, text }) => {
    if (!text) return conn.sendMessage(message.chat, { text: '[❗] ¿Qué quieres buscar en Pinterest?' }, { quoted: message });

    try {
        //conn.sendMessage(message.chat, { text: global.wait }, { quoted: message });
        let response = await pinterestSearch(text);
        if (!response.status) throw new Error(response.resultado);
        let searchResults = response.resultado;
        shuffleArray(searchResults);
        let selectedResults = searchResults.slice(0, 7);
        let imageMessages = selectedResults.map(result => createImageMessage(result.imageUrl, result.title));
        let results = imageMessages.map((imageMessage, index) => ({
            body: proto.Message.InteractiveMessage.Body.fromObject({ text: '' }),
            footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: `*❧ By ${global.wm}*` }),
            header: proto.Message.InteractiveMessage.Header.fromObject({
                title: selectedResults[index].title, 
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
                        body: proto.Message.InteractiveMessage.Body.create({ text: `*< PINTEREST SEARCH >*\n\n` + `📌 *Texto buscado:* ${text}\n\n` + `📈 *Resultados obtenidos:*` }),
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
handler.help = ['pinterestsearch <txt>'];
handler.tags = ['buscador'];
handler.command = /^(pinterestsearch|pins)$/i;
export default handler;

async function pinterestSearch(query) {
    try {
        const response = await axios.get(`https://api.pinterest.com/v3/search/pins/?query=${encodeURIComponent(query)}&fields=id,link,note,url,images`, {
            headers: {
                "Authorization": "Bearer YOUR_ACCESS_TOKEN", // Coloca aquí tu token de acceso de la API de Pinterest
            }
        });
        const pins = response.data.data;
        if (pins.length === 0) return { status: false, resultado: "No se encontraron imágenes." };
        return {
            status: true,
            resultado: pins.map(p => ({
                title: p.note ? p.note : "Sin título",
                imageUrl: p.images.original.url ? p.images.original.url : "Sin URL"
            }))
        };
    } catch (error) {
        return { status: false, resultado: error.message };
    }
}

function createImageMessage(imageUrl, title) {
    return {
        url: imageUrl,
        caption: title,
        jpegThumbnail: null // Aquí podrías agregar una miniatura si lo deseas
    };
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
