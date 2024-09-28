// Patrón para detectar posibles crashes (mensajes maliciosos)
const crashRegex = /(@[0-9A-Za-z]{18,25}@g\.us){5,}/i;

export async function before(m, { conn, isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe)
        return !0;
    if (!m.isGroup) return !1;

    let chat = global.db.data.chats[m.chat];  // Acceder a los datos del chat
    let bot = global.db.data.settings[this.user.jid] || {}; // Obtener configuraciones específicas del bot

    // Verificar si el anticrash está activado en el grupo
    if (chat.anticrash) {
        const isCrash = crashRegex.exec(m.text);  // Detectar si el mensaje contiene el patrón de crash

        // Si se detecta un mensaje sospechoso y el remitente no es administrador
        if (isCrash && !isAdmin) {
            if (isBotAdmin) {
                // Eliminar el mensaje sospechoso
                await conn.sendMessage(m.chat, { delete: m.key });
                
                // Expulsar al usuario que envió el crash
                await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');

                // Notificar a los miembros del grupo
                await conn.reply(m.chat, `Se eliminó a @${m.sender.split('@')[0]} por enviar un mensaje sospechoso (posible crash).`, null, { mentions: [m.sender] });
            } else {
                // Si el bot no es administrador, notificar que no puede actuar
                await conn.reply(m.chat, `Detecté un mensaje sospechoso de @${m.sender.split('@')[0]}, pero no soy administrador, por lo que no puedo eliminar al usuario.`, null, { mentions: [m.sender] });
            }
        }
    }
    return !0; // Continuar con el flujo normal
}
