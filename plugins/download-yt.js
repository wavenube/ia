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
        templateMessage: {
            hydratedTemplate: {
                hydratedContentText: mensaje,
                hydratedFooterText: 'Selecciona una opción',
                hydratedButtons: [
                    {
                        quickReplyButton: {
                            displayText: 'DESCARGAR VIDEO',
                            id: `${usedPrefix}video ${youtubeLink}`
                        }
                    },
                    {
                        quickReplyButton: {
                            displayText: 'DESCARGAR AUDIO',
                            id: `${usedPrefix}audio ${youtubeLink}`
                        }
                    }
                ]
            }
        }
    }, { userJid: conn.user.jid, quoted: m });

    // Enviar el mensaje
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}

// Configuración del comando
handler.command = /^(yt)$/i;

export default handler;
