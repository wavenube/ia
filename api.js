import { watchFile, unwatchFile } from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import axios from 'axios';
import moment from 'moment-timezone';

// Configuración de APIs
global.openai_key = 'sk-0';  // API Key de OpenAI
global.openai_org_id = 'org-3';  // ID de organización de OpenAI

global.MyApiRestBaseUrl = 'https://api.cafirexos.com';
global.MyApiRestApikey = 'BrunoSobrino';

global.MyApiRestBaseUrl2 = 'https://api-brunosobrino-dcaf9040.koyeb.app';
global.MyApiRestBaseUrl3 = 'https://api-brunosobrino.onrender.com'; 

// API Keys aleatorias para Zens, XTeam, Neoxr, etc.
global.keysZens = ['LuOlangNgentot', 'c2459db922', '37CC845916', '6fb0eff124', 'hdiiofficial', 'fiktod', 'BF39D349845E', '675e34de8a', '0b917b905e6f'];
global.keysxxx = global.keysZens[Math.floor(global.keysZens.length * Math.random())];

global.keysxteammm = ['29d4b59a4aa687ca', '5LTV57azwaid7dXfz5fzJu', 'cb15ed422c71a2fb', '5bd33b276d41d6b4', 'HIRO', 'kurrxd09', 'ebb6251cc00f9c63'];
global.keysxteam = global.keysxteammm[Math.floor(global.keysxteammm.length * Math.random())];

global.keysneoxrrr = ['5VC9rvNx', 'cfALv5'];
global.keysneoxr = global.keysneoxrrr[Math.floor(global.keysneoxrrr.length * Math.random())];

global.lolkeysapi = ['GataDiosV2'];  // ['BrunoSobrino_2']
global.itsrose = ['4b146102c4d500809da9d1ff'];

// APIs y sus Keys
global.APIs = {
  CFROSAPI: 'https://api.cafirexos.com',
  xteam: 'https://api.xteam.xyz',
  dzx: 'https://api.dhamzxploit.my.id',
  lol: 'https://api.lolhuman.xyz',
  neoxr: 'https://api.neoxr.my.id',
  zenzapis: 'https://api.zahwazein.xyz',
  akuari: 'https://api.akuari.my.id',
  akuari2: 'https://apimu.my.id',
  fgmods: 'https://api-fgmods.ddns.net', // API antigua, mantengo en caso de que siga siendo usada
  botcahx: 'https://api.botcahx.biz.id',
  ibeng: 'https://api.ibeng.tech/docs',
  rose: 'https://api.itsrose.site',
  popcat: 'https://api.popcat.xyz',
  xcoders: 'https://api-xcoders.site',
  vihangayt: 'https://vihangayt.me',
  erdwpe: 'https://api.erdwpe.com',
  xyroinee: 'https://api.xyroinee.xyz',
  nekobot: 'https://nekobot.xyz',
  BK9: 'https://apii.bk9.site',
  nrtm: 'https://fg-nrtm.ddns.net', // Nueva API agregada
  fgmods: 'https://api.fgmods.xyz' // Nueva API agregada
};

global.APIKeys = { // APIKey Here
  'https://api.xteam.xyz': `${global.keysxteam}`,
  'https://api.lolhuman.xyz': 'GataDios',
  'https://api.neoxr.my.id': `${global.keysneoxr}`,
  'https://api.zahwazein.xyz': `${global.keysxxx}`,
  'https://api-fgmods.ddns.net': 'fg-dylux',
  'https://api.botcahx.biz.id': 'Admin',
  'https://api.ibeng.tech/docs': 'tamvan',
  'https://api.itsrose.site': 'Rs-Zeltoria',
  'https://api-xcoders.site': 'Frieren',
  'https://api.xyroinee.xyz': 'uwgflzFEh6',
  'https://apikasu.onrender.com': 'ApiKey',
  'https://api.fgmods.xyz': 'm2XBbNvz', // API Key nueva agregada
};


// Actualización en caliente del archivo
const file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.redBright('Update "api.js"'));
  import(`${file}?update=${Date.now()}`);
});
