let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  
  let isEnable = /true|enable|(turn)?on|1/i.test(command);
  let isDisable = /false|disable|(turn)?off|0/i.test(command);
  if (!isEnable && !isDisable) return;

  let chat = global.db.data.chats[m.chat];
  let user = global.db.data.users[m.sender];
  let bot = global.db.data.settings[conn.user.jid] || {};
  let type = (args[0] || '').toLowerCase();
  let isAll = false, isUser = false;

  switch (type) {
    case 'welcome':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn);
          throw false;
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn);
        throw false;
      }
      chat.welcome = isEnable;
      break;
      
    case 'detect':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn);
          throw false;
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn);
        throw false;
      }
      chat.detect = isEnable;
      break;

    case 'modohorny':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.modohorny = isEnable;
      break;
      
    case 'antidelete':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.antidelete = isEnable;
      break;
      
    case 'antilink':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.antiLink = isEnable;
      break;

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

┌─⊷ *ADMIN*
▢ welcome
▢ antilink
▢ detect 
▢ modohorny
└─────────────
┌─⊷ *OWNER*
▢ public/private
▢ restrict
▢ gconly
▢ onlypv
└─────────────
📌 Ejemplo:
${usedPrefix}on welcome
${usedPrefix}off welcome
`);
      throw false;
  }

  m.reply(`
✅ *${type}* está *${isEnable ? 'activado' : 'desactivado'}* ${isAll ? 'para todo el bot' : isUser ? '' : 'para este chat'}
`.trim());

  // Guardar los cambios en las configuraciones del bot
  global.db.data.settings[conn.user.jid] = bot;
}

handler.help = ['enable', 'disable'].map(v => v + ' <opción>');
handler.tags = ['config'];
handler.command = /^(en|dis)able|(tru|fals)e|(turn)?on|off|[01]$/i;

export default handler;
