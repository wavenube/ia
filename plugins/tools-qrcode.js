import { toDataURL } from 'qrcode';

const handler = async (m, { text, conn }) => {
  if (!text) throw 'Por favor, proporciona un texto para generar el código QR.';
  
  const qrCodeDataURL = await toDataURL(text.slice(0, 2048), { scale: 8 });
  await conn.sendFile(m.chat, qrCodeDataURL, 'qrcode.png', 'Aquí tienes tu código QR:', m);
};

handler.help = ['', 'code'].map(v => 'qr' + v + ' <texto>');
handler.tags = ['tools'];
handler.command = /^qr(code)?$/i;

export default handler;
