import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async function (m, { conn, args, usedPrefix }) {
    if (!args[0]) throw 'Por favor, proporciona un enlace de YouTube.';

    const youtubeLink = args[0];
    const mensaje = `¿Cómo deseas descargar el contenido de YouTube?`;

    await sendInteractiveMessage(m, conn, mensaje, youtubeLink, usedPrefix);
};

// Función para enviar el mensaje interactivo con botones
async function sendInteractiveMessage(m, conn, mensaje, youtubeLink, usedPrefix) {
    // Generar el mensaje interactivo con botones
    const buttons = [
        { buttonId: `${usedPrefix}audio ${youtubeLink}`, buttonText: { displayText: 'DESCARGAR AUDIO' }, type: 1 },
        { buttonId: `${usedPrefix}video ${youtubeLink}`, buttonText: { displayText: 'DESCARGAR VIDEO' }, type: 1 }
    ];

    const buttonMessage = {
        text: mensaje,
        footer: 'Selecciona una opción',
        buttons: buttons,
        headerType: 1
    };

    await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
}

// Configuración del comando
handler.command = /^(yt)$/i;

export default handler;
