let handler = async (m, { conn, usedPrefix, command, args, isOwner, isROwner }) => {
  let isEnable = /true|enable|(turn)?now|1/i.test(command);
  let bot = global.db.data.settings[conn.user.jid] || {}; // Obtener las configuraciones específicas del bot
  let type = (args[0] || '').toLowerCase();

  switch (type) {
    // Cambia el estado del bot a privado (solo accesible por el owner)
    case 'private':
      if (!isOwner) {
        global.dfail('owner', m, conn);
        throw false;
      }
      bot.private = isEnable;
      break;

    case 'public':
      if (!isOwner) {
        global.dfail('owner', m, conn);
        throw false;
      }
      bot.private = !isEnable; // Desactivar modo privado
      break;

    default:
      return m.reply(`Opciones disponibles:

      ${usedPrefix}on private - Activar modo privado (solo el owner puede usar el bot)
      ${usedPrefix}off private - Desactivar modo privado (el bot es accesible por todos)`);
  }

  // Guardar la configuración
  global.db.data.settings[conn.user.jid] = bot;

  m.reply(`✅ El bot está ahora en modo *${isEnable ? 'privado' : 'público'}*`);
}

// Middleware para verificar si el bot está en modo privado
let verifyPrivateMode = (m, isOwner) => {
  let bot = global.db.data.settings[m.conn.user.jid] || {};
  if (bot.private && !isOwner) {
    return m.reply('🚫 El bot está en modo privado y solo el owner puede usarlo.');
  }
};

// Agregar verificación en los comandos
let anyCommandHandler = (m) => {
  verifyPrivateMode(m, m.isOwner); // Verificar si el bot está en modo privado
  // Ejecutar el comando normalmente
};

handler.help = ['on', 'off'].map(v => v + ' <private/public>');
handler.tags = ['config'];
handler.command = /^(now|non)$/i;

export default handler;
