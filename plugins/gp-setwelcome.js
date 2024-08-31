//import db from '../lib/database.js'

let handler = async (m, { conn, text, isROwner, isOwner }) => {
  if (text) {
    global.db.data.chats[m.chat].sSwagat = text
    m.reply('✅ El mensaje de bienvenida esta configurado')
  } else throw `🛸Ingresa el mensaje de bienvenida\n\n@user (mencion)\n@group (nombre del grupo)\n@desc (descripcion del grupo)`
}
handler.help = ['setwelcome <text>']
handler.tags = ['group']
handler.command = ['setwelcome'] 
handler.admin = true
handler.owner = false

export default handler
