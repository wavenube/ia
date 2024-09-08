import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import moment from 'moment-timezone' 
import fs from 'fs' 

//OwnerShip
global.owner = [
  ['5492613619545', 'Shizo Techie ❤️✨', true],
  ['50246028932', 'S.AI Bot', true],
]
global.mods = []
global.prems = []

global.author = 'Cyber Bot'
global.botname = 'CyberBot'
global.wm = 'Cyber - Bot';
 
global.imagen1 = fs.readFileSync('./media/abyss.png');
global.imagen2 = fs.readFileSync('./media/abyss2.png');
global.imagen3 = fs.readFileSync('./media/abyss3.png')
global.imagen4 = fs.readFileSync('./media/abyss4.png')
global.imagen5 = fs.readFileSync('./media/abyss5.png') 
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
