import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    // Verificar si hay un enlace de TikTok en los argumentos
    if (!args[0]) throw `✳️ Debes proporcionar un enlace de TikTok válido.\n\n📌 Ejemplo: ${usedPrefix + command} https://vm.tiktok.com/ZMYG92bUh/`;

    if (!args[0].match(/tiktok/gi)) throw `❎ Proporciona un enlace de TikTok válido.`;

    try {
        // Enviar mensaje de "procesando"
        await conn.sendMessage(m.chat, { text: '⏳ Procesando tu solicitud... por favor espera.' }, { quoted: m });

        // Llamada a la API con la URL del video de TikTok usando global.API
        let res = await fetch(`https://api.cafirexos.com/api/tiktokv1?url=${args[0]}`);
        let data = await res.json();

        // Verificar si la API devolvió un resultado
        if (!data.resultado) {
            throw new Error("No se encontró el video o hubo un error al procesar la solicitud.");
        }

        // Crear el mensaje con la información del video
        let message = `
┌─⊷ *TIKTOK DESCARGA* 
▢ *Autor:* ${data.resultado.nickname}
▢ *Usuario:* ${data.resultado.username}
▢ *Descripción:* ${data.resultado.title}
└───────────
`;

        // Enviar el video al chat
        for (let i = 0; i < (data.resultado.videoUrl ? 1 : data.resultado.imagesUrl.length); i++) {
            await conn.sendFile(m.chat, data.resultado.videoUrl ? data.resultado.videoUrl : data.resultado.imagesUrl[i], 'tiktok.mp4', message, m);
        }
    } catch (error) {
        // En caso de error, responder con un mensaje de fallo
        console.error(error);
        await conn.sendMessage(m.chat, { text: '❎ Hubo un error al procesar tu solicitud. Intenta de nuevo más tarde.' }, { quoted: m });
    }
};

handler.help = ['tiktok'];
handler.tags = ['dl'];
handler.command = ['tiktok', 'tt', 'tiktokimg', 'tiktokslide'];

export default handler;
