//import db from '../lib/database.js'

import { createHash } from 'crypto'
let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
let handler = async function (m, { conn, text, usedPrefix, command }) {
  let user = global.db.data.users[m.sender]
  let name2 = conn.getName(m.sender)
  if (user.registered === true) throw `🛸 You are already registered\n\nDo you want to re-register?\n\n 📌 Use this command to remove your record \n*${usedPrefix}unreg* <Serial number>`
  if (!Reg.test(text)) throw `⚠️ Format incorrect\n\n 🛸 Use this command: *${usedPrefix + command} name.age*\n📌Exemple : *${usedPrefix + command}* ${name2}.16`
  let [_, name, splitter, age] = text.match(Reg)
  if (!name) throw '🛸️ The name cannot be empty'
  if (!age) throw '🛸 age cannot be empty'
  if (name.length >= 30) throw '🛸 El nombre es muy largo...' 
  age = parseInt(age)
  if (age > 100) throw '👴🏻 Los abuelos no deberian usar el Bot.'
  if (age < 5) throw '🚼  Los bebes no deberian usar whatsapp.'
  user.name = name.trim()
  user.age = age
  user.regTime = + new Date
  user.registered = true
  let sn = createHash('md5').update(m.sender).digest('hex')
  m.reply(`
┌─「 *REGISTRADO* 」─
▢ *NOMBRE:* ${name}
▢ *EDAD* : ${age} years
▢ *NUMERO DE SERIE* :
${sn}
└──────────────

 *${usedPrefix}escribe #help para ver el menu
`.trim())
}
handler.help = ['reg'].map(v => v + ' <name.age>')
handler.tags = ['rg']

handler.command = ['verify', 'reg', 'register', 'registrar'] 

export default handler

