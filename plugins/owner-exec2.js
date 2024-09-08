import cp, { exec as _exec } from 'child_process';
import { promisify } from 'util';

const exec = promisify(_exec).bind(cp);

const handler = async (m, { conn, isOwner, command, text, isROwner }) => {
  if (!isROwner) return; // Solo el Root Owner puede usar el comando
  if (global.conn.user.jid != conn.user.jid) return; // Solo si es el bot principal
  m.reply("Ejecutando comando..."); // Mensaje antes de ejecutar el comando
  
  let o;
  try {
    o = await exec(command.trimStart() + ' ' + text.trimEnd());
  } catch (e) {
    o = e;
  } finally {
    const { stdout, stderr } = o;
    if (stdout.trim()) m.reply(stdout); // Mostrar la salida del comando
    if (stderr.trim()) m.reply(stderr); // Mostrar los errores, si los hay
  }
};

handler.customPrefix = /^[$]/; // Prefijo personalizado para comandos
handler.command = new RegExp; // Acepta cualquier comando después del prefijo
export default handler;
