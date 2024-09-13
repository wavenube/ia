import fetch from 'node-fetch';

const API_KEY = 'Rk34BQDyYdzCVQaqZYeco2yGRthSxcWfoeYS29fNmcF8eD6ckvHJ2ChGL4Si'; // Reemplaza con tu clave API de Stable Diffusion

const handler = async (m, { text, conn }) => {
  if (!text) return conn.reply(m.chat, 'Por favor, proporciona una descripción para generar la imagen.', m);

  try {
    const response = await fetch('https://stablediffusionapi.com/api/v3/text2img', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        prompt: text,
        negative_prompt: '',
        width: 512,
        height: 512,
        samples: 1,
        seed: null,
        guidance_scale: 7.5
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
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
