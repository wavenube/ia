let triviaSessions = {}; // Asegúrate de usar el mismo nombre que en fun-trivia.js

const handler = async (m, { conn, command }) => {
  let chatId = m.chat;

  if (command === "stoptrivia") {
    if (!triviaSessions[chatId]) {
      return conn.sendMessage(m.chat, { text: "No hay ninguna trivia activa en este chat." });
    }

    let triviaSession = triviaSessions[chatId];
    let finalScore = triviaSession.score;
    delete triviaSessions[chatId];
    conn.sendMessage(m.chat, { text: `🎉 ¡Trivia terminada! Puntaje final: ${finalScore}/${questions.length}` });
  }
};

handler.command = /^(stoptrivia)$/i;
export default handler;
