let triviaSessions = {};

const questions = [
  {
    question: "¿Cuál es el planeta más cercano al Sol?",
    options: ["a) Venus", "b) Marte", "c) Mercurio", "d) Júpiter"],
    answer: "c"
  },
  {
    question: "¿Quién escribió 'Don Quijote de la Mancha'?",
    options: ["a) William Shakespeare", "b) Miguel de Cervantes", "c) Gabriel García Márquez", "d) J.R.R. Tolkien"],
    answer: "b"
  },
  {
    question: "¿En qué año llegó el hombre a la luna?",
    options: ["a) 1965", "b) 1969", "c) 1971", "d) 1980"],
    answer: "b"
  },
];

const handler = async (m, { conn, args, command }) => {
  let chatId = m.chat;
  
  // Iniciar trivia
  if (command === "trivia") {
    if (triviaSessions[chatId]) {
      return conn.sendMessage(m.chat, { text: "Ya hay una trivia en curso en este chat." });
    }

    triviaSessions[chatId] = { score: 0, questionIndex: 0 };
    sendQuestion(m, conn, chatId);
  }

  // Responder pregunta
  if (command === "answer") {
    if (!triviaSessions[chatId]) {
      return conn.sendMessage(m.chat, { text: "No hay ninguna trivia activa." });
    }

    let currentQuestion = triviaSessions[chatId];
    if (args[0].toLowerCase() === questions[currentQuestion.questionIndex].answer) {
      triviaSessions[chatId].score++;
      conn.sendMessage(m.chat, { text: "✅ ¡Respuesta correcta!" });
    } else {
      conn.sendMessage(m.chat, { text: `❌ Respuesta incorrecta. La correcta era: ${questions[currentQuestion.questionIndex].answer}` });
    }

    if (currentQuestion.questionIndex + 1 < questions.length) {
      triviaSessions[chatId].questionIndex++;
      sendQuestion(m, conn, chatId);
    } else {
      let finalScore = triviaSessions[chatId].score;
      delete triviaSessions[chatId];
      conn.sendMessage(m.chat, { text: `🎉 ¡Trivia terminada! Puntaje final: ${finalScore}/${questions.length}` });
    }
  }
};

// Función para enviar pregunta
function sendQuestion(m, conn, chatId) {
  let triviaSession = triviaSessions[chatId];
  let question = questions[triviaSession.questionIndex];

  let message = `❓ ${question.question}\n\n${question.options.join('\n')}\n\nResponde con el comando: *.answer + opción*`;
  conn.sendMessage(m.chat, { text: message });
}

handler.command = /^(trivia|answer)$/i;
export default handler;
