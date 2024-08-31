import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async function(m, { conn, args, usedPrefix }) {
    if (!args[0]) throw 'Por favor, proporciona un enlace de YouTube.';

    const youtubeLink = args[0];
    const mensaje = `¿Cómo deseas descargar el contenido de YouTube?`;

    await sendInteractiveMessage(m, conn, mensaje, youtubeLink, usedPrefix);
};

// Función para enviar el mensaje interactivo con botones
async function sendInteractiveMessage(m, conn, mensaje, youtubeLink, usedPrefix) {
    // Generar el mensaje interactivo con botones
    const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: { text: mensaje },
                    footer: { text: 'Selecciona una opción' }, // Pie de página opcional
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: 'quick_reply',
                                buttonParamsJson: JSON.stringify({
                                    display_text: 'DESCARGAR VIDEO',
                                    id: `${usedPrefix}video`
                                })
                            },
                            {
                                name: 'quick_reply',
                                buttonParamsJson: JSON.stringify({
                                    display_text: 'DESCARGAR AUDIO',
                                    id: `${usedPrefix}audio ${youtubeLink}`
                                })
                            },
                        ],
                        messageParamsJson: "",
                    },
                },
            },
        }
    }, { userJid: conn.user.jid, quoted: m });

    // Enviar el mensaje
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}

// Configuración del comando
handler.command = /^(yt)$/i;

export default handler;
