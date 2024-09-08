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
  {
    "question": "¿Cuál es el planeta más grande del sistema solar?",
    "options": ["a) Tierra", "b) Marte", "c) Júpiter", "d) Saturno"],
    "answer": "c"
  },
  {
    "question": "¿En qué año se descubrió América?",
    "options": ["a) 1492", "b) 1500", "c) 1600", "d) 1700"],
    "answer": "a"
  },
  {
    "question": "¿Cuál es la capital de Francia?",
    "options": ["a) Berlín", "b) Madrid", "c) Roma", "d) París"],
    "answer": "d"
  },
  {
    "question": "¿Quién pintó la Mona Lisa?",
    "options": ["a) Vincent van Gogh", "b) Pablo Picasso", "c) Leonardo da Vinci", "d) Claude Monet"],
    "answer": "c"
  },
  {
    "question": "¿Cuál es el idioma oficial de Brasil?",
    "options": ["a) Español", "b) Inglés", "c) Portugués", "d) Francés"],
    "answer": "c"
  },
  {
    "question": "¿Cuál es el elemento químico con el símbolo 'Au'?",
    "options": ["a) Plata", "b) Oro", "c) Cobre", "d) Hierro"],
    "answer": "b"
  },
  {
    "question": "¿Cuál es el río más largo del mundo?",
    "options": ["a) Amazonas", "b) Nilo", "c) Yangtsé", "d) Misisipi"],
    "answer": "b"
  },
  {
    "question": "¿En qué continente se encuentra Egipto?",
    "options": ["a) Asia", "b) Europa", "c) África", "d) América"],
    "answer": "c"
  },
  {
    "question": "¿Qué número sigue al 9 en la secuencia de números romanos?",
    "options": ["a) X", "b) IX", "c) VIII", "d) XI"],
    "answer": "a"
  },
  {
    "question": "¿Qué órgano del cuerpo humano produce insulina?",
    "options": ["a) Hígado", "b) Riñón", "c) Páncreas", "d) Corazón"],
    "answer": "c"
  },
  {
    "question": "¿Cuál es el animal terrestre más rápido?",
    "options": ["a) Tigre", "b) León", "c) Guepardo", "d) Elefante"],
    "answer": "c"
  },
  {
    "question": "¿Cuál es la capital de Japón?",
    "options": ["a) Beijing", "b) Seúl", "c) Tokio", "d) Bangkok"],
    "answer": "c"
  },
  {
    "question": "¿Qué número es la raíz cuadrada de 64?",
    "options": ["a) 6", "b) 8", "c) 10", "d) 12"],
    "answer": "b"
  },
  {
    "question": "¿Quién fue el primer hombre en caminar sobre la Luna?",
    "options": ["a) Neil Armstrong", "b) Buzz Aldrin", "c) Yuri Gagarin", "d) John Glenn"],
    "answer": "a"
  },
  {
    "question": "¿Cuál es el nombre del libro sagrado del Islam?",
    "options": ["a) Biblia", "b) Torá", "c) Corán", "d) Vedas"],
    "answer": "c"
  },
  {
    "question": "¿Cuál es el océano más grande del mundo?",
    "options": ["a) Atlántico", "b) Pacífico", "c) Índico", "d) Ártico"],
    "answer": "b"
  },
  {
    "question": "¿Qué elemento químico tiene el símbolo 'H'?",
    "options": ["a) Helio", "b) Hidrógeno", "c) Hierro", "d) Carbono"],
    "answer": "b"
  },
  {
    "question": "¿Cuál es el nombre de la canción de Queen que incluye la letra 'We are the champions'?",
    "options": ["a) Bohemian Rhapsody", "b) We Will Rock You", "c) We Are the Champions", "d) Somebody to Love"],
    "answer": "c"
  },
  {
    "question": "¿En qué año comenzó la Primera Guerra Mundial?",
    "options": ["a) 1912", "b) 1914", "c) 1918", "d) 1920"],
    "answer": "b"
  },
  {
    "question": "¿Cuál es la capital de Australia?",
    "options": ["a) Sídney", "b) Melbourne", "c) Brisbane", "d) Canberra"],
    "answer": "d"
  },
  {
    "question": "¿Quién fue el primer presidente de los Estados Unidos?",
    "options": ["a) Thomas Jefferson", "b) Abraham Lincoln", "c) George Washington", "d) John Adams"],
    "answer": "c"
  }
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
