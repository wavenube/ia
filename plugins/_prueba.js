import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

const handler = async (m, { conn }) => {
  const buttons = [
    {
      buttonId: 'test_1',
      buttonText: { displayText: 'Test de Alimentación' },
      type: 1,
    },
    {
      buttonId: 'test_2',
      buttonText: { displayText: 'Test de Ejercicio' },
      type: 1,
    },
  ];

  const messageContent = {
    interactiveMessage: {
      message: {
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: 'Elige una opción:',
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: 'Selecciona una opción',
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons,
          }),
        }),
      },
    },
  };

  const msg = await generateWAMessageFromContent(m.chat, messageContent, {});
  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
};

const responseHandler = async (m, { conn }) => {
  const buttonId = m.message.interactiveMessage.buttonId;

  if (buttonId === 'test_1') {
    // Aquí va la lógica para el Test de Alimentación
    await conn.sendMessage(m.chat, { text: 'Inicia el Test de Alimentación' }, { quoted: m });
  } else if (buttonId === 'test_2') {
    // Aquí va la lógica para el Test de Ejercicio
    await conn.sendMessage(m.chat, { text: 'Inicia el Test de Ejercicio' }, { quoted: m });
  }
};

export { handler, responseHandler };

module.exports = {
  help: ['test'],
  tags: ['test'],
  command: /^test$/i,
  handler,
  responseHandler,
};
