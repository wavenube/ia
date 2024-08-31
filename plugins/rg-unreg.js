//import db from '../lib/database.js'

import { createHash } from 'crypto'
let handler = async function (m, { conn, args, usedPrefix}) {
  if (!args[0]) throw `🛸 *Ingresa tu numero de serie*\nMira tu numero de serie con el comando...\n\n*${usedPrefix}nserie*`
  let user = global.db.data.users[m.sender]
  let sn = createHash('md5').update(m.sender).digest('hex')
  if (args[0] !== sn) throw '⚠️ *Su numero de serie es incorrecto*'
  user.registered = false
  m.reply(`✅ Se ha eliminado tu registro`)
}
handler.help = ['unreg <Num Serie>'] 
handler.tags = ['rg']

handler.command = ['unreg'] 
handler.register = true

export default handler

