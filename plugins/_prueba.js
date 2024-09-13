import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

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

handler.help = ['test'];
handler.tags = ['interactive'];
handler.command = /^test$/i;

export default handler;
