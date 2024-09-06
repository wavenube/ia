 
import fg from 'api-dylux'
import fetch from 'node-fetch'
let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    
        if (!args[0]) throw `✳️ ${m.noLink('TikTok')}\n\n 📌 ${m.example} : ${usedPrefix + command} https://vm.tiktok.com/ZMYG92bUh/`
        if (!args[0].match(/tiktok/gi)) throw `❎ ${m.noLink('TikTok')}`
        conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }})
      
        try {
        let res = await fetch(global.API('fgmods', '/api/downloader/tiktok', { url: args[0] }, 'apikey'))
        let data = await res.json()

        if (!data.result.images) {
            let tex = `
┌─⊷ *TIKTOK DL* 
▢ *${m.name}:* ${data.result.author.nickname}
▢ *${m.username}:* ${data.result.author.unique_id}
▢ *${m.duration}:* ${data.result.duration}
▢ *Likes:* ${data.result.digg_count}
▢ *${m.views}:* ${data.result.play_count}
▢ *${m.desc}:* ${data.result.title}
└───────────
`
            conn.sendFile(m.chat, data.result.play, 'tiktok.mp4', tex, m);
            m.react(done)
        } else {
            let cap = `
▢ *Likes:* ${data.result.digg_count}
▢ *${m.desc}:* ${data.result.title}
`
            for (let ttdl of data.result.images) {
                conn.sendMessage(m.chat, { image: { url: ttdl }, caption: cap }, { quoted: m })
            }
            conn.sendFile(m.chat, data.result.play, 'tiktok.mp3', '', m, null, { mimetype: 'audio/mp4' })
            conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }})
        }

      } catch (error) {
        conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }})
    }
   
}

handler.help = ['tiktok']
handler.tags = ['dl']
handler.command = ['tiktok', 'tt', 'tiktokimg', 'tiktokslide']
handler.diamond = true

export default handler
