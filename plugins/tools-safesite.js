import axios from 'axios';

let handler = async (m, { args }) => {
  if (!args[0]) return m.reply('Por favor, proporciona un URL válido para verificar.');
  
  const url = args[0];
  const apiKey = '7a86923bf11572066e88c5cf5a161bbd965f8775c9238a8c5390db0aea57042d'; // Reemplaza con tu API key
  
  try {
    // Enviar solicitud a VirusTotal
    const res = await axios.get(`https://www.virustotal.com/vtapi/v2/url/report`, {
      params: {
        apikey: apiKey,
        resource: url,
      },
    });

    const data = res.data;
    
    if (data.response_code === 1) {
      // Si se encontró un reporte para el sitio
      const positives = data.positives;
      const total = data.total;
      const status = positives > 0 ? `⚠️ Sitio inseguro` : `✅ Sitio seguro`;
      const result = `🔗 *Verificación de URL:* ${url}\n\n🔍 *Resultado:* ${status}\n\n📊 *Detecciones:* ${positives}/${total}\n🌐 *Fuente:* VirusTotal`;
      m.reply(result);
    } else {
      m.reply('No se encontraron reportes para este sitio.');
    }
  } catch (err) {
    console.error(err);
    m.reply('Ocurrió un error al verificar el sitio. Intenta de nuevo más tarde.');
  }
};

handler.command = /^(verificarurl|checkurl|seguridadurl)$/i;
export default handler;
