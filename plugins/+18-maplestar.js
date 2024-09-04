import fs from 'fs';
import path from 'path';
import { proto, generateWAMessageFromContent } from '@whiskeysockets/baileys';

let handler = async (message, { conn }) => {
    const videoDir = './src/videos';  // Directory containing the videos
    const files = fs.readdirSync(videoDir).filter(file => file.endsWith('.mp4'));  // Get all .mp4 files

    if (files.length === 0) return conn.sendMessage(message.chat, { text: 'No videos found in the directory.' }, { quoted: message });

    let carouselItems = [];
    for (let file of files) {
        let videoPath = path.join(videoDir, file);
        let videoBuffer = fs.readFileSync(videoPath);

        let videoMessage = await conn.prepareMessage(message.chat, { video: videoBuffer }, { upload: conn.waUploadToServer });

        carouselItems.push({
            header: proto.Message.InteractiveMessage.Header.fromObject({
                title: `Video: ${file}`, 
                hasMediaAttachment: true, 
                videoMessage: videoMessage.videoMessage
            }),
            body: proto.Message.InteractiveMessage.Body.fromObject({ text: '' }),
            footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: 'Choose a video to watch' }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: [] })
        });
    }

    const responseMessage = generateWAMessageFromContent(message.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                    body: proto.Message.InteractiveMessage.Body.create({ text: 'Videos Available:' }),
                    footer: proto.Message.InteractiveMessage.Footer.create({ text: '' }),
                    header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
                    carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards: carouselItems })
                })
            }
        }
    }, { quoted: message });

    await conn.relayMessage(message.chat, responseMessage.message, { messageId: responseMessage.key.id });
};

handler.help = ['getvideos'];
handler.tags = ['videos'];
handler.command = /^getvideos$/i;

export default handler;
