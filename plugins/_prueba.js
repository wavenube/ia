import fetch from 'node-fetch';

const API_KEY = 'tSEV06zXjzbNAWHcJzRrGqMzznplPCO9gweuIFMncKaJ5B3SdinqfEHuQhff'; // Reemplaza con tu clave API de Stable Diffusion

const handler = async (m, { text, conn }) => {
  if (!text) return conn.reply(m.chat, 'Por favor, proporciona una descripción para generar la imagen.', m);

  try {
    // Realiza la solicitud a la API
    const response = await fetch('https://stablediffusionapi.com/api/v3/text2img', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        key: API_KEY,
        prompt: text,
        negative_prompt: '',
        width: '512',
        height: '512',
        samples: '1',
        num_inference_steps: '20',
        safety_checker: 'no',
        enhance_prompt: 'yes',
        temp: 'yes',
        seed: null,
        guidance_scale: 7.5,
        webhook: null,
        track_id: null
      })
    });

    // Obtén la respuesta en formato JSON
    const data = await response.json();

    // Imprime la respuesta para depuración
    console.log(data);

    // Maneja el error si existe
    if (data.status === 'error') {
      throw new Error(data.message || 'Error desconocido');
    }

    // Verifica si 'output' existe y contiene una URL
    if (!data.output || !data.output[0]) {
      throw new Error('No se encontró una URL de imagen en la respuesta.');
    }

    const imageUrl = data.output[0]; // Suponiendo que `data.output` es un array de URLs de imágenes

    // Envía la imagen generada
    await conn.sendMessage(m.chat, { image: { url: imageUrl } }, { quoted: m });
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, `Error al generar la imagen: ${error.message}`, m);
  }
};

handler.help = ['generate'].map(v => v + ' <description>');
handler.tags = ['fun'];
handler.command = /^(generate)$/i;

export default handler;
