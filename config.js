import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import moment from 'moment-timezone' 
import fs from 'fs' 

//OwnerShip
global.owner = [
  ['5492613619545', 'Shizo Techie ❤️✨', true],
  ['34682075812', 'S.AI Bot', true],
]
global.mods = []
global.prems = []

global.author = 'Cyber Bot'
global.botname = 'CyberBot'
global.wm = 'Cyber - Bot';
 
 
 //Api's
global.APIs = {
  shizoapi: 'https://shizoapi.onrender.com'
}
global.APIKeys = { 
  'https://shizoapi.onrender.com': 'shizo'
}

//Apikeys
global.shizokeys = 'shizo'

//Sticker Watermarks
global.stkpack = 'CyberBot'
global.stkowner = '© CyberBot'

//management
global.bug = '*!! Lo siento 💢 !!*\nAlgo salio mal 🌋'
global.stop = '*!! 🎭 Desafortunadamente 💔 !!*\nMi sistema no esta respondiendo 🙃'

//TimeLines
global.botdate = `*[ 📅 ] Fecha:*  ${moment.tz('Asia/Kolkata').format('DD/MM/YY')}`
global.bottime = `*[ ⏳ ] Hora:* ${moment.tz('Asia/Kolkata').format('HH:mm:ss')}`



let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
