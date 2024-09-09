const pauseHandler = async (m, { conn, isOwner }) => {
  if (!isOwner) return m.reply('❌ Solo los administradores pueden pausar el bot.');
  
  isPaused = true;
  m.reply('⏸️ El bot ha sido pausado. Usa ".start" para reactivarlo.');
};

handler.command = /^pausa$/i;
export default pauseHandler;
