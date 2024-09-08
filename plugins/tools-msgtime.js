let schedule = require('node-schedule');

// Función para manejar el comando de programación de mensajes
const handler = async (m, { conn, args }) => {
    let timeArg = args[0]; // Argumento de tiempo (ej: 5m, 2h, 1d)
    let phoneNumber = args[1]; // Número de teléfono
    let messageText = args.slice(2).join(' ') || ''; // Mensaje programado

    if (!timeArg || !phoneNumber) {
        return conn.sendMessage(m.chat, { text: '❌ Debes proporcionar el tiempo y el número de teléfono. Ejemplo: .msgtime 5m 123456789 Hola!' }, { quoted: m });
    }

    // Parsear el tiempo en milisegundos
    let timeInMs;
    if (timeArg.endsWith('m')) {
        timeInMs = parseInt(timeArg) * 60 * 1000; // Minutos a milisegundos
    } else if (timeArg.endsWith('h')) {
        timeInMs = parseInt(timeArg) * 60 * 60 * 1000; // Horas a milisegundos
    } else if (timeArg.endsWith('d')) {
        timeInMs = parseInt(timeArg) * 24 * 60 * 60 * 1000; // Días a milisegundos
    } else {
        return conn.sendMessage(m.chat, { text: '❌ El formato de tiempo no es válido. Usa m para minutos, h para horas o d para días.' }, { quoted: m });
    }

    // Confirmar que el mensaje fue programado
    conn.sendMessage(m.chat, { text: `🕒 Mensaje programado para enviarse a ${phoneNumber} en ${timeArg}.` }, { quoted: m });

    // Programar el envío del mensaje
    setTimeout(async () => {
        // Enviar el mensaje al destinatario
        await conn.sendMessage(phoneNumber + '@s.whatsapp.net', { text: messageText });

        // Notificar al usuario que el mensaje fue enviado
        await conn.sendMessage(m.chat, { text: `✅ Mensaje enviado a ${phoneNumber} con éxito a las ${new Date().toLocaleTimeString()}.` }, { quoted: m });

    }, timeInMs);
};

handler.command = /^(msgtime)$/i;
export default handler;
