import axios from 'axios';

const handler = async (m, { conn, text, args, usedPrefix, command }) => {
    if (!text) throw `Debes proporcionar una URL de TikTok. Ejemplo: *${usedPrefix}${command} https://www.tiktok.com/@user/video/1234567890*`;

    const tiktokUrl = args[0];

    if (!/(https?:\/\/)?(www\.)?(vm|m|vt|tiktok)\.com\/[^\s&]+/i.test(tiktokUrl)) {
        throw `Enlace de TikTok no válido. Usa un enlace como: *${usedPrefix}${command} https://www.tiktok.com/@user/video/1234567890*`;
    }

    try {
        // Realizar la solicitud a ssstik.io API
        const { data } = await axios.get(`https://api.ssstik.io/tiktok/tiktok_dl_no_wm`, {
            params: {
                url: tiktokUrl
            }
        });

        // Verificar si la descarga fue exitosa
        if (data.status !== 'ok') {
            throw 'Error al descargar el video. Verifica el enlace y vuelve a intentarlo.';
        }

        // Enviar el video descargado
        await conn.sendMessage(m.chat, { video: { url: data.link } }, { quoted: m });
    } catch (e) {
        console.error(e);
        throw 'Error al descargar el video. Verifica el enlace y vuelve a intentarlo.';
    }
};

handler.command = /^(tiktok|ttdl|tiktokdl|tiktoknowm)$/i;
export default handler;
