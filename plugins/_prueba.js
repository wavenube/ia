import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'; // O la librería que uses para WhatsApp

const handler = async (m, { conn, text }) => {
  // Validación para asegurarse de que se envía el comando correctamente
  if (!text) return conn.reply(m.chat, 'Por favor, proporciona el texto para el test.', m);

  try {
    // Crea el mensaje interactivo usando el código que te proporcionaron
    let msg = await generateWAMessageFromContent(
      m.chat, // El ID del chat
      {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text, // El texto que se pasará en el comando
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: 'TuBotName', // Footer personalizado
              }),
              nativeFlowMessage:
                proto.Message.InteractiveMessage.NativeFlowMessage.create({
                  buttons: [
                    {
                      name: 'galaxy_message',
                      buttonParamsJson: JSON.stringify({
                        screen_2_OptIn_0: true,
                        screen_2_OptIn_1: true,
                        screen_1_Dropdown_0: 'test',
                        screen_1_DatePicker_1: '1028995200000',
                        screen_1_TextInput_2: 'test',
                        screen_1_TextInput_3: '94643116',
                        screen_0_TextInput_0: 'radio-buttons', // Puedes personalizar esto
                        screen_0_TextInput_1: 'test',
                        screen_0_Dropdown_2: '001-Grimgar',
                        screen_0_RadioButtonsGroup_3: '0_true',
                        flow_token: 'AQAAAAACS5FpgQ_cAAAAAE0QI3s.',
                      }),
                    },
                  ],
                }),
            }),
          },
        },
      },
      {}
    );

    // Envía el mensaje interactivo al usuario
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
  } catch (error) {
    console.error('Error enviando el test interactivo:', error);
    m.reply('Hubo un error al generar el test interactivo.');
  }
};

handler.help = ['testgalaxy <texto>'];
handler.tags = ['tools'];
handler.command = /^testgalaxy$/i; // El comando que activará el test

export default handler;
