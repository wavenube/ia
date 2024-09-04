import { default as axios } from 'axios';

let handler = async (message, { conn }) => {
    try {
        const mediaUrl = "https://qu.ax/scZw.mp4";
        const thumbnailUrl = "https://i.ibb.co/Qjf1sdk/abyss-profile.png"; // URL de la miniatura
        const title = "Abyss Bot";
        const body = "By: ZephyrByte";

        const messageContent = {
            externalAdReply: {
                mediaUrl: mediaUrl,
                mediaType: 2, // VIDEO
                description: 'Haz clic para ver el video',
                title: title,
                body: body,
                thumbnailUrl: thumbnailUrl,
                sourceUrl: mediaUrl
            }
        };

        await conn.sendMessage(message.chat, messageContent, { quoted: message });
    } catch (error) {
        console.error("Error al enviar el mensaje:", error);
        await conn.reply(message.chat, "Hubo un error al intentar enviar el mensaje.", message);
    }
};

handler.command = ['getvideo'];
export default handler;
