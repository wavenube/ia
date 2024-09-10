import axios from 'axios';

let handler = async (m, { conn, text }) => {
  await m.reply("Buscando...");
  if (!text) return conn.reply(m.chat, "Por favor ingrese un número de teléfono válido", m);

  try {
    let res = await axios.get(`https://api.apilayer.com/number_verification/validate?number=${text}`, {
      headers: {
        'apikey': 'nHjiLKzeDHDwKPri3VmZPECG5mgrpwYT' // Reemplaza con tu clave API de apilayer o similar
      }
    });

    const data = res.data;

    if (!data.valid) {
      return conn.reply(m.chat, "El número no es válido o no se encontró información", m);
    }

    let phoneInfo = `
    𝐈𝐍𝐅𝐎 𝐃𝐄𝐋 𝐍Ú𝐌𝐄𝐑𝐎
    
    Número: ${data.number}
    Internacional: ${data.international_format}
    Local: ${data.local_format}
    País: ${data.country_name} (${data.country_code})
    Ubicación: ${data.location || "No disponible"}
    Compañía: ${data.carrier || "No disponible"}
    Tipo de línea: ${data.line_type || "No disponible"}
    `.trim();

    await conn.reply(m.chat, phoneInfo, m);
  } catch (error) {
    console.error(error);
    await conn.reply(m.chat, 'Ocurrió un error al obtener la información del número.', m);
  }
};

handler.tags = ['tools'];
handler.command = /^(numcheck|phoneinfo)$/i;
handler.owner = true;

export default handler;
