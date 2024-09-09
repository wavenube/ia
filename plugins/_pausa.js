let handler = async (m, { conn }) => {
  if (global.isPaused) {
    return conn.sendMessage(m.chat, { text: '❌ El bot ya está en pausa.' });
  }
  
  global.isPaused = true;
  conn.sendMessage(m.chat, { text: '⏸️ Bot pausado. No se ejecutarán más comandos hasta que se reanude con .start.' });
};

handler.command = ['pausa'];
handler.rowner = true; // Solo el dueño del bot puede pausar

export default handler;
