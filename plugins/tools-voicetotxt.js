import {speech} from '@google-cloud/speech';
import fs from 'fs';

// Configuración del cliente de Google Cloud Speech-to-Text
const client = new speech.SpeechClient();

const handler = async (m, { conn }) => {
  if (!m.quoted || !/audio|voice/.test(m.quoted.mimetype)) {
    return conn.sendMessage(m.chat, { text: "Envía o responde a una nota de voz para convertirla a texto." });
  }

  const audioBuffer = await m.quoted.download();
  
  // Guardar el audio temporalmente
  const audioFilePath = './tmp/audio.ogg';
  fs.writeFileSync(audioFilePath, audioBuffer);
  
  // Configuración de la solicitud de transcripción
  const audio = {
    content: audioBuffer.toString('base64'),
  };

  const config = {
    encoding: 'OGG_OPUS', // Formato de la nota de voz
    sampleRateHertz: 16000, // Asegúrate de ajustar según la nota de voz
    languageCode: 'es-ES', // Puedes cambiar a otro idioma si es necesario
  };

  const request = {
    audio: audio,
    config: config,
  };

  try {
    // Enviar la solicitud a Google Cloud
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    if (transcription) {
      conn.sendMessage(m.chat, { text: `📝 Transcripción: ${transcription}` });
    } else {
      conn.sendMessage(m.chat, { text: "No se pudo transcribir la nota de voz." });
    }
  } catch (error) {
    console.error("Error al transcribir la nota de voz:", error);
    conn.sendMessage(m.chat, { text: "Hubo un error al procesar la nota de voz." });
  }

  // Limpiar el archivo temporal
  fs.unlinkSync(audioFilePath);
};

handler.command = ['totxt', 'vtotext']; // Comandos que activan el handler
export default handler;
