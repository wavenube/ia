import fg from 'api-dylux';
import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    
    if (!args[0]) throw `✳️ Debes proporcionar un enlace de TikTok.\n\n📌 Ejemplo: ${usedPrefix + command} https://vm.tiktok.com/ZMYG92bUh/`;
    if (!args[0].match(/tiktok/gi)) throw `❎ El enlace proporcionado no es de TikTok.`;

    // Reacciona con un emoji de carga mientras procesa la solicitud
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key }});

    try {
        // Llamada a la API para obtener los datos de TikTok
        let res = await fetch(global.API('fgmods', '/api/downloader/tiktok', { url: args[0] }, 'apikey'));
        let data = await res.json();

        if (!data.result.images) {
            let tex = `
┌─⊷ *TIKTOK DL* 
▢ *Nombre:* ${data.result.author.nickname}
▢ *Usuario:* ${data.result.author.unique_id}
▢ *Duración:* ${data.result.duration}
▢ *Likes:* ${data.result.digg_count}
▢ *Vistas:* ${data.result.play_count}
▢ *Descripción:* ${data.result.title}
└───────────
`;
            // Enviar el video de TikTok
            await conn.sendFile(m.chat, data.result.play, 'tiktok.mp4', tex, m);
            await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }}); // Reacción de éxito
        } else {
            let cap = `
▢ *Likes:* ${data.result.digg_count}
▢ *Descripción:* ${data.result.title}
`;
            // Enviar imágenes de TikTok
            for (let ttdl of data.result.images) {
                await conn.sendMessage(m.chat, { image: { url: ttdl }, caption: cap }, { quoted: m });
            }
            // Enviar el audio de TikTok
            await conn.sendFile(m.chat, data.result.play, 'tiktok.mp3', '', m, null, { mimetype: 'audio/mp4' });
            await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }}); // Reacción de éxito
        }

    } catch (error) {
        // En caso de error, responde con un mensaje y una reacción de error
        await conn.sendMessage(m.chat, { text: "❎ Hubo un error al procesar tu solicitud. Intenta de nuevo más tarde." }, { quoted: m });
    }
}

handler.help = ['tiktok'];
handler.tags = ['dl'];
handler.command = ['tiktok', 'tt', 'tiktokimg', 'tiktokslide'];
handler.diamond = true;

export default handler;
