const startHandler = async (m, { conn, isOwner }) => {
  if (!isOwner) return m.reply('❌ Solo los administradores pueden reactivar el bot.');

  isPaused = false;
  m.reply('▶️ El bot ha sido reactivado y ahora acepta comandos nuevamente.');
};

handler.command = /^start$/i;
export default startHandler;
