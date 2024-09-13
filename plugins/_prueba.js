const { generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');

const handler = async (m, { conn }) => {
  const menuMessage = {
    interactiveMessage: {
      body: proto.Message.InteractiveMessage.Body.create({
        text: 'Selecciona una opción:',
      }),
      footer: proto.Message.InteractiveMessage.Footer.create({
        text: 'Tu bot',
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
        buttons: [
          {
            name: 'option1',
            buttonParamsJson: JSON.stringify({
              flow_token: 'your_flow_token_for_option_1',
            }),
            buttonText: 'Test de Alimentación',
          },
          {
            name: 'option2',
            buttonParamsJson: JSON.stringify({
              flow_token: 'your_flow_token_for_option_2',
            }),
            buttonText: 'Test de Ejercicio',
          },
        ],
      }),
    },
  };

  let msg = await generateWAMessageFromContent(
    m.chat,
    { viewOnceMessage: { message: menuMessage } },
    {}
  );

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
};

const responseHandler = async (m, { conn }) => {
  if (!m.message || !m.message.interactiveMessage) return;

  const { buttonParamsJson } = m.message.interactiveMessage.nativeFlowMessage.buttons[0];
  const { flow_token } = JSON.parse(buttonParamsJson);

  switch (flow_token) {
    case 'your_flow_token_for_option_1':
      await sendNutritionTest(m.chat, conn);
      break;
    case 'your_flow_token_for_option_2':
      await sendExerciseTest(m.chat, conn);
      break;
    default:
      m.reply('Opción no válida.');
  }
};

const sendNutritionTest = async (chat, conn) => {
  // Envía el test de nutrición
  await conn.sendMessage(chat, { text: 'Aquí está tu test de alimentación...' });
};

const sendExerciseTest = async (chat, conn) => {
  // Envía el test de ejercicio
  await conn.sendMessage(chat, { text: 'Aquí está tu test de ejercicio...' });
};

module.exports = { handler, responseHandler };

module.exports = {
  help: ['test'],
  tags: ['test'],
  command: /^test$/i,
  handler,
  responseHandler,
};
