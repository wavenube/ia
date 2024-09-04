import fs from 'fs';

let handler = async (message, { conn }) => {
    const imagePath = './media/abyss.png'; // Ruta de la imagen
    const videoUrl = 'https://qu.ax/scZw.mp4'; // Enlace al que se redirige

    try {
        const imageBuffer = fs.readFileSync(imagePath);

        // Crea el mensaje con la imagen y el contextInfo para hacerla redirigible
        const messageOptions = {
            image: imageBuffer,
            caption: "Click en la imagen para ver el video.",
            contextInfo: {
                externalAdReply: {
                    title: "Haz clic para ver el video",
                    body: "Video Link",
                    mediaType: 1,
                    thumbnail: imageBuffer,
                    mediaUrl: videoUrl,
                    sourceUrl: videoUrl,
                }
            }
        };

        await conn.sendMessage(message.chat, messageOptions, { quoted: message });
    } catch (error) {
        await conn.sendMessage(message.chat, { text: `Error: ${error.message}` }, { quoted: message });
    }
};

handler.help = ['getvideo'];
handler.tags = ['utility'];
handler.command = /^(getvideo)$/i;
export default handler;
