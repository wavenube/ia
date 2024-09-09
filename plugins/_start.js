async function commandHandler(m, command, args) {
  // Si el bot está en pausa y el comando no es "start", no hacer nada
  if (isPaused && command !== 'start') {
    return m.reply('⚠️ El bot está en pausa. Usa ".start" para reactivarlo.');
  }

  // Aquí va la lógica normal de manejo de comandos
  // Ejecuta el comando correspondiente si no está en pausa o es "start"
}
