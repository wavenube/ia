// triviaManager.js
const triviaSessions = {};

export function getTriviaSessions() {
  return triviaSessions;
}

export function setTriviaSession(chatId, session) {
  triviaSessions[chatId] = session;
}

export function removeTriviaSession(chatId) {
  delete triviaSessions[chatId];
}
