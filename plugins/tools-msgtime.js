let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (args.length < 3) {
        return conn.sendMessage(m.chat, { text: `Uso correcto: ${usedPrefix + command} <tiempo> <número> <mensaje>\nEjemplo: ${usedPrefix + command} 5m 12345678900 Hola!` }, { quoted: m });
    }

    let timeInput = args[0];
    let timeValue = parseInt(timeInput.slice(0, -1)); // Extraer el valor del tiempo
    let timeUnit = timeInput.slice(-1); // Extraer la unidad de tiempo (m, h, d)
    let number = args[1]; // El número de teléfono
    let message = args.slice(2).join(' '); // El mensaje programado

    // Validar el tiempo y convertirlo en milisegundos
    let delay;
    if (timeUnit === 'm') {
        delay = timeValue * 60 * 1000; // Minutos a milisegundos
    } else if (timeUnit === 'h') {
        delay = timeValue * 60 * 60 * 1000; // Horas a milisegundos
    } else if (timeUnit === 'd') {
        delay = timeValue * 24 * 60 * 60 * 1000; // Días a milisegundos
    } else {
        return conn.sendMessage(m.chat, { text: 'Por favor, ingrese una unidad de tiempo válida (m, h, d).' }, { quoted: m });
    }

    conn.sendMessage(m.chat, { text: `Mensaje programado para ${number} en ${timeValue}${timeUnit}` }, { quoted: m });

    // Programar el envío del mensaje después del tiempo indicado
    setTimeout(() => {
        conn.sendMessage(number + '@s.whatsapp.net', { text: message });
    }, delay);
};

handler.command = /^(msgtime|programarmsg)$/i;
export default handler;
