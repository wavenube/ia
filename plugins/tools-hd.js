import FormData from 'form-data';
import fs from 'fs';
import Jimp from 'jimp';

const handler = async (m, { conn, usedPrefix, command }) => {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || "";
    
    // Verificar que el MIME type sea de una imagen JPEG o PNG
    if (!mime) throw `Por favor, responde a una imagen con el comando ${usedPrefix + command}.`;
    if (!/image\/(jpe?g|png)/.test(mime)) throw `Tipo de archivo no válido: (${mime}). Por favor, envía una imagen JPEG o PNG.`;
    
    m.reply('Procesando imagen, por favor espera...');
    
    let img = await q.download?.();
    let pr = await remini(img, "enhance");
    conn.sendMessage(m.chat, { image: pr }, { quoted: m });
  } catch (error) {
    throw `Hubo un error al procesar la imagen: ${error.message}`;
  }
};

handler.help = ["remini", "hd", "enhance"];
handler.tags = ["ai", "tools"];
handler.command = ["remini", "hd", "enhance"];

export default handler;

async function remini(imageData, operation) {
  return new Promise(async (resolve, reject) => {
    const availableOperations = ["enhance", "recolor", "dehaze"];
    if (!availableOperations.includes(operation)) {
      operation = availableOperations[0];
    }
    
    const baseUrl = "https://inferenceengine.vyro.ai/" + operation + ".vyro";
    const formData = new FormData();
    formData.append("image", Buffer.from(imageData), { filename: "enhance_image_body.jpg", contentType: "image/jpeg" });
    formData.append("model_version", 1, { "Content-Transfer-Encoding": "binary", contentType: "multipart/form-data; charset=utf-8" });

    formData.submit({
      url: baseUrl,
      host: "inferenceengine.vyro.ai",
      path: "/" + operation,
      protocol: "https:",
      headers: {
        "User-Agent": "okhttp/4.9.3",
        "Connection": "Keep-Alive",
        "Accept-Encoding": "gzip"
      }
    }, function (err, res) {
      if (err) return reject(err);
      
      const chunks = [];
      res.on("data", function (chunk) { chunks.push(chunk); });
      res.on("end", function () { resolve(Buffer.concat(chunks)); });
      res.on("error", function (err) { reject(err); });
    });
  });
}
