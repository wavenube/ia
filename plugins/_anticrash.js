// Definir un límite máximo de caracteres permitido
const MAX_CHAR_LIMIT = 1000; // Puedes ajustar este valor

export async function before(m, { conn, isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe)
        return !0;
    if (!m.isGroup) return !1;

    let chat = global.db.data.chats[m.chat];  // Acceder a los datos del chat
    let bot = global.db.data.settings[this.user.jid] || {}; // Obtener configuraciones específicas del bot

    // Verificar si el anticrash está activado en el grupo
    if (chat.anticrash) {
        const isCrash = m.text.length > MAX_CHAR_LIMIT;  // Detectar si el mensaje supera el límite de caracteres

        // Si se detecta un mensaje sospechoso y el remitente no es administrador
        if (isCrash && !isAdmin) {
            if (isBotAdmin) {
                // Eliminar el mensaje sospechoso
                await conn.sendMessage(m.chat, { delete: m.key });
                
                // Expulsar al usuario que envió el posible crash
                await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');

                // Notificar a los miembros del grupo sobre la expulsión
                await conn.reply(m.chat, `🚫 *Se eliminó a @${m.sender.split('@')[0]} por enviar un mensaje sospechoso (posible crash).*`, null, { mentions: [m.sender] });
            } else {
                // Si el bot no es administrador, notificar que no puede actuar
                await conn.reply(m.chat, `⚠️ *Mensaje sospechoso detectado de @${m.sender.split('@')[0]}, pero no soy administrador, por lo que no puedo eliminar al usuario. Administradores, por favor, revisen.*`, null, { mentions: [m.sender] });
            }
        }
    }
    return !0; // Continuar con el flujo normal
}
