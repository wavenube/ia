let schedule = require('node-schedule');

// Función para manejar el comando
const handler = async (m, { conn, args, command }) => {
    let timeArg = args[0];
    let phoneNumber = args[1];
    let messageText = args.slice(2).join(' ') || '';

    if (!timeArg || !phoneNumber) {
        return conn.sendMessage(m.chat, { text: '❌ Debes proporcionar el tiempo y el número de teléfono. Ejemplo: .msgtime 5m 123456789 Hola!' }, { quoted: m });
    }

    // Parsear el tiempo en milisegundos
    let timeInMs;
    if (timeArg.endsWith('m')) {
        timeInMs = parseInt(timeArg) * 60 * 1000;
    } else if (timeArg.endsWith('h')) {
        timeInMs = parseInt(timeArg) * 60 * 60 * 1000;
    } else if (timeArg.endsWith('d')) {
        timeInMs = parseInt(timeArg) * 24 * 60 * 60 * 1000;
    } else {
        return conn.sendMessage(m.chat, { text: '❌ El formato de tiempo no es válido. Usa m para minutos, h para horas o d para días.' }, { quoted: m });
    }

    // Verificar si hay archivos adjuntos (imagen o video)
    const media = m.message?.imageMessage || m.message?.videoMessage;

    if (media) {
        // Descargar el archivo multimedia
        let mediaBuffer = await conn.downloadMediaMessage(m);

        // Programar el mensaje
        setTimeout(async () => {
            // Enviar el mensaje programado con el archivo multimedia
            await conn.sendMessage(phoneNumber + '@s.whatsapp.net', {
                [media.mimetype.startsWith('image') ? 'image' : 'video']: mediaBuffer,
                caption: messageText
            });

            // Enviar informe de que el mensaje ha sido enviado
            await conn.sendMessage(m.chat, { text: `✅ Mensaje enviado a ${phoneNumber} con éxito.` }, { quoted: m });
        }, timeInMs);

    } else {
        // Programar solo el mensaje de texto
        setTimeout(async () => {
            // Enviar el mensaje programado sin archivo multimedia
            await conn.sendMessage(phoneNumber + '@s.whatsapp.net', { text: messageText });

            // Enviar informe de que el mensaje ha sido enviado
            await conn.sendMessage(m.chat, { text: `✅ Mensaje enviado a ${phoneNumber} con éxito.` }, { quoted: m });
        }, timeInMs);
    }

    // Confirmar la programación al usuario
    conn.sendMessage(m.chat, { text: `🕒 Mensaje programado para enviarse a ${phoneNumber} en ${timeArg}.` }, { quoted: m });
};

handler.command = /^(msgtime)$/i;
export default handler;
