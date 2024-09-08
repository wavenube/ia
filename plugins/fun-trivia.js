import pkg from 'lodash';
const { shuffle } = pkg;

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
  },
  {
    "question": "¿Cuál es el nombre completo de la famosa teoría de Einstein?",
    "options": ["a) Teoría de la Relatividad Especial", "b) Teoría de la Relatividad General", "c) Teoría de la Gravedad Cuántica", "d) Teoría del Big Bang"],
    "answer": "b"
  },
  {
    "question": "¿En qué país se encuentra la ciudad de Petra, famosa por sus estructuras excavadas en la roca?",
    "options": ["a) Jordania", "b) Egipto", "c) Grecia", "d) Turquía"],
    "answer": "a"
  },
  {
    "question": "¿Cuál es la capital de Mongolia?",
    "options": ["a) Ulaanbaatar", "b) Astana", "c) Tashkent", "d) Bishkek"],
    "answer": "a"
  },
  {
    "question": "¿Cuál es el nombre del órgano en el cuerpo humano que produce la bilis?",
    "options": ["a) Estómago", "b) Hígado", "c) Riñón", "d) Páncreas"],
    "answer": "b"
  },
  {
    "question": "¿Cuál es el segundo elemento más abundante en la atmósfera terrestre?",
    "options": ["a) Oxígeno", "b) Hidrógeno", "c) Nitrógeno", "d) Argón"],
    "answer": "c"
  },
  {
    "question": "¿Qué civilización antigua construyó las pirámides de Teotihuacán?",
    "options": ["a) Aztecas", "b) Mayas", "c) Toltecas", "d) Olmecas"],
    "answer": "c"
  },
  {
    "question": "¿En qué país se encuentra el Parque Nacional de los Glaciares, conocido por sus grandes masas de hielo?",
    "options": ["a) Argentina", "b) Chile", "c) Canadá", "d) Noruega"],
    "answer": "a"
  },
  {
    "question": "¿Quién fue el emperador romano durante el período de la mayor expansión del Imperio Romano?",
    "options": ["a) Julio César", "b) Augusto", "c) Nerón", "d) Trajano"],
    "answer": "d"
  },
  {
    "question": "¿Qué famosa obra literaria comienza con la frase 'En un lugar de la Mancha, de cuyo nombre no quiero acordarme...'?",
    "options": ["a) 'La Iliada'", "b) 'Cien años de soledad'", "c) 'Don Quijote de la Mancha'", "d) 'La Odisea'"],
    "answer": "c"
  },
  {
    "question": "¿Qué filósofo griego es conocido por su obra 'La República'?",
    "options": ["a) Sócrates", "b) Platón", "c) Aristóteles", "d) Epicuro"],
    "answer": "b"
  },
  {
    "question": "¿Cuál es el nombre del satélite natural de la Tierra?",
    "options": ["a) Fobos", "b) Deimos", "c) Luna", "d) Titán"],
    "answer": "c"
  },
  {
    "question": "¿Cuál es el metal que tiene el símbolo químico 'Hg'?",
    "options": ["a) Mercurio", "b) Plata", "c) Oro", "d) Cobre"],
    "answer": "a"
  },
  {
    "question": "¿Qué antiguo imperio se ubicaba en la región del actual Irán y fue conocido por su sistema de gobierno burocrático?",
    "options": ["a) Imperio Persa", "b) Imperio Otomano", "c) Imperio Bizantino", "d) Imperio Mongol"],
    "answer": "a"
  },
  {
    "question": "¿Quién es el autor de la novela 'Cien años de soledad'?",
    "options": ["a) Gabriel García Márquez", "b) Mario Vargas Llosa", "c) Julio Cortázar", "d) Pablo Neruda"],
    "answer": "a"
  },
  {
    "question": "¿Cuál es el nombre de la primera misión espacial tripulada que llegó a la Luna?",
    "options": ["a) Apolo 11", "b) Apolo 12", "c) Apolo 13", "d) Apolo 14"],
    "answer": "a"
  },
  {
    "question": "¿Qué elemento químico es conocido como 'el rey de los metales' por su resistencia a la corrosión?",
    "options": ["a) Cobre", "b) Plata", "c) Oro", "d) Platino"],
    "answer": "c"
  },
  {
    "question": "¿Qué filósofo es conocido por la máxima 'Pienso, luego existo'?",
    "options": ["a) René Descartes", "b) Immanuel Kant", "c) Friedrich Nietzsche", "d) Karl Marx"],
    "answer": "a"
  },
  {
    "question": "¿En qué país se encuentra la ciudad de Dubrovnik, conocida por su casco antiguo amurallado?",
    "options": ["a) Croacia", "b) Italia", "c) Grecia", "d) España"],
    "answer": "a"
  },
  {
    "question": "¿Qué tipo de estrella es el Sol en términos de su evolución estelar?",
    "options": ["a) Estrella enana blanca", "b) Estrella gigante roja", "c) Estrella principal secuencia", "d) Supernova"],
    "answer": "c"
  },
  {
    "question": "¿Cuál es el nombre del protocolo utilizado para la transmisión de datos en redes informáticas?",
    "options": ["a) HTTP", "b) FTP", "c) TCP/IP", "d) SMTP"],
    "answer": "c"
  },
  {
    "question": "¿Cuál es la ciudad más poblada del mundo?",
    "options": ["a) Tokio", "b) Shanghái", "c) Nueva York", "d) São Paulo"],
    "answer": "a"
  },
  {
    "question": "¿En qué año se firmó la Declaración de Independencia de los Estados Unidos?",
    "options": ["a) 1776", "b) 1789", "c) 1791", "d) 1804"],
    "answer": "a"
  },
  {
    "question": "¿Qué genio del Renacimiento pintó el fresco de la Capilla Sixtina?",
    "options": ["a) Leonardo da Vinci", "b) Miguel Ángel", "c) Rafael", "d) Botticelli"],
    "answer": "b"
  },
  {
    "question": "¿Qué país es conocido por el festival de la cerveza Oktoberfest?",
    "options": ["a) Alemania", "b) Austria", "c) Suiza", "d) Países Bajos"],
    "answer": "a"
  }

];

const handler = async (m, { conn, args, command }) => {
  let chatId = m.chat;
  
  // Iniciar trivia
  if (command === "trivia") {
    if (triviaSessions[chatId]) {
      return conn.sendMessage(m.chat, { text: "Ya hay una trivia en curso en este chat." });
    }

    triviaSessions[chatId] = { score: 0, questions: shuffle(questions), userAnswers: {} };
    sendQuestion(m, conn, chatId);
  }

  // Responder pregunta
  if (command === "answer") {
    if (!triviaSessions[chatId]) {
      return conn.sendMessage(m.chat, { text: "No hay ninguna trivia activa." });
    }

    let triviaSession = triviaSessions[chatId];
    let currentQuestion = triviaSession.questions[0];
    
    if (args[0].toLowerCase() === currentQuestion.answer) {
      triviaSession.score++;
      conn.sendMessage(m.chat, { text: "✅ ¡Respuesta correcta!" });
    } else {
      conn.sendMessage(m.chat, { text: `❌ Respuesta incorrecta. La correcta era: ${currentQuestion.answer}` });
    }

    triviaSession.userAnswers[m.sender] = triviaSession.score;

    triviaSession.questions.shift();

    if (triviaSession.questions.length > 0) {
      sendQuestion(m, conn, chatId);
    } else {
      let finalScore = triviaSession.score;
      delete triviaSessions[chatId];
      conn.sendMessage(m.chat, { text: `🎉 ¡Trivia terminada! Puntaje final: ${finalScore}/${questions.length}` });
    }
  }
};

// Función para enviar pregunta
function sendQuestion(m, conn, chatId) {
  let triviaSession = triviaSessions[chatId];
  let question = triviaSession.questions[0];

  let message = `❓ ${question.question}\n\n${question.options.join('\n')}\n\nResponde con el comando: *.answer + opción*`;
  conn.sendMessage(m.chat, { text: message });
}

handler.command = /^(trivia|answer)$/i;
export default handler;
