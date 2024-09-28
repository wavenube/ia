import * as fs from 'fs';

let handler = async (m, { conn, isAdmin, isBotAdmin, command }) => {
    try {
        // Si no es el comando .anticrash, no hacer nada
        if (command !== 'anticrash') return;

        // Detectar si el mensaje es sospechoso
        const isCrash = detectCrash(m.text);
        
        if (isCrash) {
            // Si el bot no es administrador, no puede hacer nada
            if (!isBotAdmin) {
                return conn.sendMessage(m.chat, { text: 'No soy administrador, no puedo hacer nada.' });
            }

            // Si el mensaje es de un administrador, el bot no lo eliminará
            if (isAdmin) {
                return conn.sendMessage(m.chat, { text: `@${m.sender.split('@')[0]} es administrador, no puedo eliminar el mensaje.`, mentions: [m.sender] });
            }

            // Eliminar el mensaje de crash
            await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: m.key.participant } });

            // Eliminar al usuario que envió el crash
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');

            // Enviar una notificación de que el usuario fue eliminado
            conn.sendMessage(m.chat, { text: `Se eliminó a @${m.sender.split('@')[0]} por enviar un mensaje sospechoso (crash).`, mentions: [m.sender] });
        }
    } catch (e) {
        console.error(e);
        conn.sendMessage(m.chat, { text: 'Hubo un error al procesar el mensaje.' });
    }
};

// Función para detectar si un mensaje es un crash
function detectCrash(text) {
    if (!text) return false;

    // Si el mensaje tiene más de 5000 caracteres, ya es sospechoso
    if (text.length > 5000) return true;

    // Patrones comunes de crash:
    const crashPatterns = [
        /@120363161387074194@g.us/g, // Patrones de múltiples menciones a grupos repetidos
        /(\S+@\S+\.\S+){10,}/g, // Muchos correos o referencias repetidas
        /(wa\.me\/\d+){10,}/g, // Múltiples links wa.me
    ];

    // Verificar si el texto contiene alguno de los patrones sospechosos
    for (let pattern of crashPatterns) {
        if (pattern.test(text)) return true;
    }

    return false;
}

// Detalles del comando
handler.help = ['anticrash'];
handler.tags = ['admin'];
handler.command = /^(anticrash)$/i; // El comando puede ser ejecutado solo como .anticrash

export default handler;
