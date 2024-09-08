import { getTriviaSessions, removeTriviaSession } from './_triviaManager.js';

const handler = async (m, { conn, command }) => {
  let chatId = m.chat;

  if (command === "stoptrivia") {
    if (!getTriviaSessions()[chatId]) {
      return conn.sendMessage(m.chat, { text: "No hay ninguna trivia activa en este chat." });
    }

    // Finalizar trivia
    removeTriviaSession(chatId);
    conn.sendMessage(m.chat, { text: "✅ Trivia finalizada. No se puede responder más hasta que se inicie una nueva trivia." });
  }
};

handler.command = /^(stoptrivia)$/i;
export default handler;
