let handler = async (m, { conn, usedPrefix, command, args, isOwner, isROwner }) => {
  
  let isEnable = /true|enable|(turn)?on|1/i.test(command);
  let isDisable = /false|disable|(turn)?off|0/i.test(command);
  if (!isEnable && !isDisable) return;

  let bot = global.db.data.settings[conn.user.jid] || {};
  let type = (args[0] || '').toLowerCase();
  let isAll = false;

  switch (type) {
    case 'public':
      if (!isROwner) {
        global.dfail('rowner', m, conn);
        throw false;
      }
      bot.self = false; // Cambiar a modo público
      m.reply('El bot está ahora en modo público. Todos pueden usarlo.');
      break;

    case 'private':
      if (!isROwner) {
        global.dfail('rowner', m, conn);
        throw false;
      }
      bot.self = true; // Cambiar a modo privado
      m.reply('El bot está ahora en modo privado. Solo los propietarios pueden usarlo.');
      break;

    case 'restrict':
      isAll = true;
      if (!isOwner) {
        global.dfail('owner', m, conn);
        throw false;
      }
      bot.restrict = isEnable;
      break;
      
    case 'gconly':
      isAll = true;
      if (!isROwner) {
        global.dfail('rowner', m, conn);
        throw false;
      }
      global.opts['gconly'] = isEnable;
      break;

    case 'onlypv':
    case 'onlydm':
      isAll = true;
      if (!isROwner) {
        global.dfail('rowner', m, conn);
        throw false;
      }
      global.opts['pconly'] = isEnable;
      break;

    default:
      m.reply(`
Opciones disponibles para personalizar:

┌─⊷ *OWNER*
▢ public/private
▢ restrict
▢ gconly
▢ onlypv
└─────────────
📌 Ejemplo:
${usedPrefix}on private
${usedPrefix}off private
`);
      throw false;
  }

  // Guardar los cambios en las configuraciones del bot
  global.db.data.settings[conn.user.jid] = bot;
  m.reply(`
✅ *${type}* está *${isEnable ? 'activado' : 'desactivado'}* para todo el bot
`.trim());
}

handler.help = ['enable', 'disable'].map(v => v + ' <opción>');
handler.tags = ['config'];
handler.command = /^(en|dis)able|(tru|fals)e|(turn)?on|off|[01]$/i;

export default handler;
