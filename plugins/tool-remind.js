const schedule = {};
let handler = async (m, { text, args, usedPrefix, command }) => {
  if (!args[0]) throw `Uso: ${usedPrefix + command} [tiempo] [mensaje] [+recurrente (opcional)]\nEj: ${usedPrefix + command} 10m Recordar tarea`;

  const timeStr = args[0];
  const message = args.slice(1).join(' ').split('+')[0].trim();
  const recurrence = args.join(' ').includes('+') ? args.join(' ').split('+')[1].trim().toLowerCase() : null;

  if (!message) throw 'Por favor, especifica el mensaje del recordatorio.';

  let timeMs;
  if (timeStr.endsWith('m')) timeMs = parseInt(timeStr) * 60 * 1000;
  else if (timeStr.endsWith('h')) timeMs = parseInt(timeStr) * 60 * 60 * 1000;
  else if (timeStr.endsWith('d')) timeMs = parseInt(timeStr) * 24 * 60 * 60 * 1000;
  else throw 'Por favor, especifica el tiempo correctamente (ej: 10m, 2h, 3d)';

  const user = m.sender;
  const remindAt = Date.now() + timeMs;

  if (!schedule[user]) schedule[user] = [];

  const sendReminder = () => {
    conn.sendMessage(user, { text: `🔔 *Recordatorio*: ${message}` }, { quoted: m });

    if (recurrence === 'diario') setTimeout(sendReminder, 24 * 60 * 60 * 1000); // Repite diario
    if (recurrence === 'semanal') setTimeout(sendReminder, 7 * 24 * 60 * 60 * 1000); // Repite semanal
    if (recurrence === 'mensual') setTimeout(sendReminder, 30 * 24 * 60 * 60 * 1000); // Repite mensual
  };

  schedule[user].push(setTimeout(sendReminder, timeMs));

  conn.sendMessage(user, { text: `✅ Recordatorio programado para *${message}* en ${timeStr}.` }, { quoted: m });
};

handler.help = ['remind'];
handler.tags = ['tools'];
handler.command = ['remind', 'recordatorio', 'recordar'];

export default handler;
