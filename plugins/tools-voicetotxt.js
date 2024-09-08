import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { Model, Recognizer } from 'vosk';

const modelPath = './models/es'; // Cambia esto según el modelo descargado

const handler = async (m, { conn }) => {
  if (!m.quoted || !/audio|voice/.test(m.quoted.mimetype)) {
    return conn.sendMessage(m.chat, { text: "Envía o responde a una nota de voz para convertirla a texto." });
  }

  const audioBuffer = await m.quoted.download();
  
  // Guardar el audio temporalmente
  const audioFilePath = './tmp/audio.ogg';
  fs.writeFileSync(audioFilePath, audioBuffer);

  // Convertir a WAV
  const wavFilePath = './tmp/audio.wav';
  ffmpeg(audioFilePath)
    .toFormat('wav')
    .on('end', async () => {
      try {
        // Inicializar el modelo Vosk
        const model = new Model(modelPath);
        const rec = new Recognizer({ model: model, sampleRate: 16000 });

        const data = fs.readFileSync(wavFilePath);
        rec.acceptWaveform(data);

        const result = rec.finalResult();
        const transcription = result.text;

        if (transcription) {
          conn.sendMessage(m.chat, { text: `📝 Transcripción: ${transcription}` });
        } else {
          conn.sendMessage(m.chat, { text: "No se pudo transcribir la nota de voz." });
        }
      } catch (error) {
        console.error("Error al procesar la nota de voz:", error);
        conn.sendMessage(m.chat, { text: "Hubo un error al procesar la nota de voz." });
      }

      // Limpiar archivos temporales
      fs.unlinkSync(audioFilePath);
      fs.unlinkSync(wavFilePath);
    })
    .on('error', (error) => {
      console.error("Error en FFmpeg:", error);
      conn.sendMessage(m.chat, { text: "Hubo un error al procesar la nota de voz." });
    })
    .save(wavFilePath);
};

handler.command = ['totxt', 'vtotext']; // Comandos que activan el handler
export default handler;
