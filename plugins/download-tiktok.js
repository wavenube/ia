import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    // Verificar si hay un enlace de TikTok en los argumentos
    if (!args[0]) throw `✳️ Debes proporcionar un enlace de TikTok válido.\n\n📌 Ejemplo: ${usedPrefix + command} https://vm.tiktok.com/ZMYG92bUh/`;
    
    if (!args[0].match(/tiktok/gi)) throw `❎ Proporciona un enlace de TikTok válido.`;

    try {
        // Llamada a la API con la URL del video de TikTok
        let res = await fetch(global.API('fgmods', '/api/downloader/tiktok', { url: args[0] }, 'apikey'));
        let data = await res.json();

        // Verificar si la API devolvió un resultado
        if (!data.result || !data.result.play) {
            throw new Error("No se encontró el video o hubo un error al procesar la solicitud.");
        }

        // Crear el mensaje con la información del video
        let message = `
┌─⊷ *TIKTOK DESCARGA* 
▢ *Autor:* ${data.result.author.nickname}
▢ *Usuario:* ${data.result.author.unique_id}
▢ *Duración:* ${data.result.duration} segundos
▢ *Likes:* ${data.result.digg_count}
▢ *Vistas:* ${data.result.play_count}
▢ *Descripción:* ${data.result.title}
└───────────
`;

        // Enviar el video al chat
        await conn.sendFile(m.chat, data.result.play, 'tiktok.mp4', message, m);
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
