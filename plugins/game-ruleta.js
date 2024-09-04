const ruletaCooldown = 300000; // 5 minutos de tiempo de reutilización

function msToTime(duration) {
  const milliseconds = parseInt((duration % 1000) / 100);
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? '0' + hours : hours;
  minutes = (minutes < 10) ? '0' + minutes : minutes;
  seconds = (seconds < 10) ? '0' + seconds : seconds;

  return hours + ' horas, ' + minutes + ' minutos y ' + seconds + ' segundos';
}

const handlerRuletaRusa = async (m, { conn }) => {
  const usuarioActual = global.db.data.users[m.sender];
  const tiempoRestante = usuarioActual.lastruleta + ruletaCooldown - Date.now();

  if (tiempoRestante > 0) {
    const tiempoRestanteFormateado = msToTime(tiempoRestante);
    throw `⏱️¡Espera ${tiempoRestanteFormateado} para jugar a la Ruleta Rusa de nuevo!`;
  }

  const resultado = Math.random() < 0.5 ? '¡Sobreviviste a la Ruleta Rusa! 😅' : '¡BOOM! La Ruleta Rusa te ha derribado. 💥';
  const recompensa = resultado.includes('Sobreviviste') ? Math.floor(Math.random() * 1000) + 500 : -500;

  usuarioActual.exp += recompensa;
  usuarioActual.lastruleta = Date.now();

  m.reply(`🔫 ¡Click! ${resultado}\n${recompensa > 0 ? `Ganaste ${recompensa} XP.` : `Perdiste ${-recompensa} XP.`}`);
};

handlerRuletaRusa.help = ['ruletarusa'];
handlerRuletaRusa.tags = ['game'];
handlerRuletaRusa.command = ['ruletarusa', 'ruleta'];

export default handlerRuletaRusa;
