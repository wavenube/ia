import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

// Handler para el comando .yt + link
const handler = async function (m, { conn, args, usedPrefix }) {
    if (!args[0]) throw 'Por favor, proporciona un enlace de YouTube.';

    const youtubeLink = args[0];
    const mensaje = `¿Cómo deseas descargar el contenido de YouTube?`;

    await sendInteractiveMessage(m, conn, mensaje, youtubeLink, usedPrefix);
};

// Función para enviar el mensaje interactivo con botones
async function sendInteractiveMessage(m, conn, mensaje, youtubeLink, usedPrefix) {
    const buttonMessage = {
        text: mensaje,
        footer: 'Selecciona una opción',
        buttons: [
            {
                buttonId: `${usedPrefix}audio ${youtubeLink}`, // Ejecuta el comando .audio <link>
                buttonText: { displayText: 'DESCARGAR AUDIO' },
                type: 1
            },
            {
                buttonId: `${usedPrefix}video ${youtubeLink}`, // Ejecuta el comando .video <link>
                buttonText: { displayText: 'DESCARGAR VIDEO' },
                type: 1
            }
        ],
        headerType: 1
    };

    const messageContent = {
        interactiveMessage: {
            body: buttonMessage.text,
            footer: buttonMessage.footer,
            nativeFlowMessage: {
                buttons: buttonMessage.buttons.map(btn => ({
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({
                        display_text: btn.buttonText.displayText,
                        id: btn.buttonId
                    })
                })),
                messageParamsJson: "",
            },
        }
    };

    const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: messageContent
        }
    }, { userJid: conn.user.jid, quoted: m });

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}

// Configuración del comando
handler.command = /^(yt)$/i;

export default handler;
