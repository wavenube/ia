let handler = async (m, { conn }) => {
  if (!global.isPaused) {
    return conn.sendMessage(m.chat, { text: '✅ El bot ya está activo.' });
  }

  global.isPaused = false;
  conn.sendMessage(m.chat, { text: '▶️ Bot reactivado. Los comandos vuelven a estar disponibles.' });
};

handler.command = ['start'];
handler.rowner = true; // Solo el dueño del bot puede reanudar

export default handler;
