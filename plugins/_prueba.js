let handler = async (m, { conn, args, isOwner }) => {
    let isEnable = /now|enable|1/i.test(args[0]); // Determina si se activará o desactivará el private
    let bot = global.db.data.settings[conn.user.jid] || {}; // Obtener configuración del bot

    if (!isOwner) {
        return conn.reply(m.chat, '🚫 Solo el owner puede activar o desactivar el modo privado.', m);
    }

    // Cambiar el estado del bot
    if (args[0] === 'private') {
        bot.private = true; // Activar modo privado
        conn.reply(m.chat, '🔒 El bot ahora está en modo privado. Solo el owner puede usarlo.', m);
    } else if (args[0] === 'public') {
        bot.private = false; // Desactivar modo privado
        conn.reply(m.chat, '🔓 El bot ahora está en modo público. Todos los usuarios pueden usarlo.', m);
    } else {
        return conn.reply(m.chat, 'Uso correcto: .on private | .off private', m);
    }

    global.db.data.settings[conn.user.jid] = bot; // Guardar el estado del bot
};

handler.command = /^(now|off)$/i;
handler.owner = true; // Solo el owner puede ejecutar este comando

export default handler;
