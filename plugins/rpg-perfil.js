import { createHash } from 'crypto';
import PhoneNumber from 'awesome-phonenumber';
import fetch from 'node-fetch';
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

const handler = async (m, { conn, usedPrefix, participants, isPrems }) => {
  // Configuración de la imagen de perfil por defecto
  let pp = 'https://telegra.ph/file/06cc652844ea19e8aed1c.jpg';
  
  // Identificar al usuario mencionado o al emisor del mensaje
  const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
  
  // Verificar que el usuario esté registrado en la base de datos
  if (!(who in global.db.data.users)) {
    throw 'El usuario no está registrado.';
  }

  try {
    // Obtener la imagen de perfil del usuario
    pp = await conn.profilePictureUrl(who);
  } catch (e) {
    // En caso de error, se mantiene la imagen por defecto
  } finally {
    // Obtener datos del usuario desde la base de datos
    const { name, limit, lastclaim, registered, regTime, age, premiumTime } = global.db.data.users[who];
    const username = conn.getName(who);
    const prem = global.prems.includes(who.split('@')[0]);
    const sn = createHash('md5').update(who).digest('hex');
    
    // Construir la cadena de perfil
    const str = `Nombre: ${username} ${registered ? '(' + name + ') ': ''}
Número: ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
Enlace: wa.me/${who.split('@')[0]}${registered ? ' Edad: ' + age : ''}
Límites: ${limit}
Registro: ${registered ? 'Registrado' : 'No registrado'}
Premium: ${premiumTime > 0 ? 'Sí' : (isPrems ? 'Premium' : 'No premium')}
Hash: ${sn}`;
    
    // Construir el mensaje con la decoración
    const contextInfo = {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363318622514917@newsletter",
        serverMessageId: 1,
        newsletterName: "Abyss Bot"
      },
      externalAdReply: {
        mediaUrl: "https://whatsapp.com/channel/0029VakDx9I0gcfFXnzZIX2v",
        mediaType: 'VIDEO',
        description: 'Canal del grupo',
        title: 'Abyss Bot',
        body: "By: ZephyrByte",
        thumbnailUrl: "https://i.ibb.co/Qjf1sdk/abyss-profile.png",
        sourceUrl: "https://whatsapp.com/channel/0029VakDx9I0gcfFXnzZIX2v"
      }
    };

    // Enviar el mensaje con la imagen de perfil y la cadena de perfil
    const msg = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
      imageMessage: {
        jpegThumbnail: await conn.getFile(pp).then(({ data }) => data),
        caption: str,
        contextInfo
      }
    }), { userJid: conn.user.jid, quoted: m });

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
  }
};

handler.help = ['profile [@user]'];
handler.tags = ['xp'];
handler.command = /^perfil|profile?$/i;

export default handler;
