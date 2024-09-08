let triviaSessions = {};
let triviaScores = {};

const handler = async (m, { conn, command }) => {
  let chatId = m.chat;

  // Detener trivia y mostrar resultados
  if (command === "stoptrivia") {
    if (!triviaSessions[chatId]) {
      return conn.sendMessage(m.chat, { text: "No hay ninguna trivia activa en este chat." });
    }

    let playerScores = triviaScores[chatId];
    let resultMessage = "📝 Resultados de la trivia:\n\n";

    for (let player in playerScores) {
      resultMessage += `- ${player}: ${playerScores[player]} correctas\n`;
    }

    delete triviaSessions[chatId];
    delete triviaScores[chatId];

    conn.sendMessage(m.chat, { text: resultMessage });
  }
};

handler.command = /^stoptrivia$/i;
export default handler;
