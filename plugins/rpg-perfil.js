import { createHash } from 'crypto';
import PhoneNumber from 'awesome-phonenumber';
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

const handler = async (m, { conn, usedPrefix, isPrems }) => {
  let pp = 'https://telegra.ph/file/06cc652844ea19e8aed1c.jpg';
  const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;

  if (!(who in global.db.data.users)) {
    throw 'El usuario no está registrado.';
  }

  try {
    pp = await conn.profilePictureUrl(who);
  } catch (e) {
    // Mantener la imagen por defecto en caso de error
  } finally {
    const { name, limit, lastclaim, registered, regTime, age, premiumTime } = global.db.data.users[who];
    const username = conn.getName(who);
    const prem = global.prems.includes(who.split('@')[0]);
    const sn = createHash('md5').update(who).digest('hex');

    const str = `Nombre: ${username} ${registered ? '(' + name + ') ': ''}
Número: ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
Enlace: wa.me/${who.split('@')[0]}${registered ? ' Edad: ' + age : ''}
Límites: ${limit}
Registro: ${registered ? 'Registrado' : 'No registrado'}
Premium: ${premiumTime > 0 ? 'Sí' : (isPrems ? 'Premium' : 'No premium')}
Hash: ${sn}`;

    await sendInteractiveMessage(m, conn, str, usedPrefix);
  }
};

async function sendInteractiveMessage(m, conn, mensaje, usedPrefix) {
  const buttonMessage = {
    text: mensaje,
    footer: 'Selecciona una opción',
    buttons: [
      { buttonId: `${usedPrefix}allmenu`, buttonText: { displayText: 'MENU COMPLETO' }, type: 1 },
      { buttonId: `${usedPrefix}perfil`, buttonText: { displayText: 'PERFIL' }, type: 1 }
    ],
    headerType: 1 // Utilizamos headerType 1 para el mensaje de texto
  };

  const msg = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
    templateMessage: {
      hydratedTemplate: {
        hydratedContentText: mensaje,
        hydratedFooterText: 'Selecciona una opción',
        hydratedButtons: [
          {
            urlButton: {
              displayText: 'MENU COMPLETO',
              url: `https://wa.me/?text=${usedPrefix}allmenu`
            }
          },
          {
            urlButton: {
              displayText: 'PERFIL',
              url: `https://wa.me/?text=${usedPrefix}perfil`
            }
          }
        ]
      }
    }
  }), { userJid: conn.user.jid, quoted: m });

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}

handler.command = /^perfil|profile?$/i;

export default handler;
