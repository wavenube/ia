
let handler = async (m, { conn, args, text, usedPrefix, command }) => {
if (!text) throw `🛸 Ingresa el numero que deseas invitar con\n\n📌 Ejemplo :\n*${usedPrefix + command}*34682075812`
if (text.includes('+')) throw  `Ingresa el numero sin *+*`
if (isNaN(text)) throw ' 📌 Ingrese solo números sin su código de país sin espacios'
let group = m.chat
let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group)
 
      await conn.reply(text+'@s.whatsapp.net', `🛸 *INVITACION AL GRUPO*\n\nUn usuario te invito a formar parte del grupo \n\n${link}`, m, {mentions: [m.sender]})
        m.reply(`✅ Una invitacion fue enviada a el usuario`) 

}
handler.help = ['invite <919172x>']
handler.tags = ['group']
handler.command = ['invite','invitar'] 
handler.group = true
handler.admin = false
handler.botAdmin = true

export default handler
