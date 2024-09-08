let triviaSessions = {};

const handler = async (m, { conn, command }) => {
  let chatId = m.chat;
  
  if (command === "stoptrivia") {
    if (!triviaSessions[chatId]) {
      return conn.sendMessage(m.chat, { text: "No hay ninguna trivia activa en este chat." });
    }

    delete triviaSessions[chatId];
    conn.sendMessage(m.chat, { text: "✅ Trivia finalizada." });
  }
};

handler.command = /^(stoptrivia)$/i;
export default handler;
