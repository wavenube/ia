import { execSync } from 'child_process';

const handler = async (m, { conn, text }) => {
  try {
    // Ejecutar el comando `git pull` para actualizar el repositorio
    const stdout = execSync('git pull' + (m.fromMe && text ? ' ' + text : ''));
    let messager = stdout.toString();

    // Verificar el mensaje devuelto por el comando `git pull`
    if (messager.includes('Already up to date.')) {
      messager = 'El repositorio ya está actualizado.';
    }
    if (messager.includes('Updating')) {
      messager = 'Actualización completada:\n' + stdout.toString();
    }

    // Responder con el mensaje adecuado
    conn.reply(m.chat, messager, m);

  } catch (error) {
    try {
      // En caso de error, verificar si hay conflictos en los archivos
      const status = execSync('git status --porcelain');
      if (status.length > 0) {
        const conflictedFiles = status
          .toString()
          .split('\n')
          .filter(line => line.trim() !== '')
          .map(line => {
            if (line.includes('.npm/') || line.includes('.cache/') || line.includes('tmp/') || line.includes('Authenticators/') || line.includes('npm-debug.log')) {
              return null;
            }
            return '*→ ' + line.slice(3) + '*';
          })
          .filter(Boolean);

        if (conflictedFiles.length > 0) {
          const errorMessage = `Conflictos detectados en los siguientes archivos:\n\n${conflictedFiles.join('\n')}.*`;
          await conn.reply(m.chat, errorMessage, m);
        }
      }
    } catch (error) {
      console.error(error);
      let errorMessage2 = 'Ocurrió un error durante la actualización.';
      if (error.message) {
        errorMessage2 += '\n*- Mensaje de error:* ' + error.message;
      }
      await conn.reply(m.chat, errorMessage2, m);
    }
  }
};

handler.command = /^(update|actualizar|gitpull)$/i;
handler.rowner = true;

export default handler;
