let handler = async (m, { conn, isAdmin }) => {
  if (m.fromMe) throw 'Gracias por el admin.'
  if (isAdmin) throw 'Ahora'
await m.reply(`Awwww 🥰`)
  await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote')
}
handler.command = /^autoadmin$/i
handler.rowner = true 

export default handler
