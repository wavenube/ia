import { setTimeout as delay } from 'timers/promises';

const handler = async (m, { conn, args, command }) => {
    if (args.length < 3) return conn.sendMessage(m.chat, { text: '⚠️ Debes proporcionar el tiempo, el número y el mensaje.' });

    const timeInput = args[0]; // Tiempo (ej. "5m", "2h", "3d")
    const number = args[1]; // Número de teléfono
    const message = args.slice(2).join(' '); // Mensaje a enviar

    let timeMs;
    if (timeInput.endsWith('m')) {
        timeMs = parseInt(timeInput) * 60 * 1000; // Minutos a milisegundos
    } else if (timeInput.endsWith('h')) {
        timeMs = parseInt(timeInput) * 60 * 60 * 1000; // Horas a milisegundos
    } else if (timeInput.endsWith('d')) {
        timeMs = parseInt(timeInput) * 24 * 60 * 60 * 1000; // Días a milisegundos
    } else {
        return conn.sendMessage(m.chat, { text: '⚠️ Formato de tiempo incorrecto. Usa m (minutos), h (horas) o d (días).' });
    }

    const senderNumber = m.sender.split('@')[0]; // Número del solicitante

    // Notificar al usuario que el mensaje fue programado
    conn.sendMessage(m.chat, { text: `✅ Mensaje programado para enviarse en ${timeInput} al número ${number}.` });

    // Programar el envío del mensaje
    await delay(timeMs);

    // Enviar el mensaje al número indicado
    await conn.sendMessage(`${number}@s.whatsapp.net`, { text: message });

    // Notificar al solicitante que el mensaje fue enviado
    await conn.sendMessage(`${senderNumber}@s.whatsapp.net`, { text: `✅ Tu mensaje programado fue enviado a ${number} correctamente.` });
};

handler.command = /^msgtime$/i;
export default handler;
