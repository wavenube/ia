import { getTracks } from '@green-code/music-track-data';
import { googleImage } from '@bochilteam/scraper';
import axios from 'axios'; // Reemplazado 'got' por 'axios' para mantener consistencia
import cheerio from 'cheerio';
import fs from 'fs';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    const teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : '';
    if (!teks) throw `*Por favor, proporciona el nombre de la canción.*`;
    try {
        const result = await getTracks(teks);
        let lyrics;
        if (result) {
            lyrics = await searchLyrics(`${result[0]?.artist} ${result[0]?.title}`);
        } else {
            lyrics = await searchLyrics(`${teks}`);
        }
        const tituloL = result[0].title ? result[0].title : lyrics.title;
        const artistaL = result[0].artist ? result[0].artist : lyrics.artist;
        const res = await fetch(global.API('https://some-random-api.com', '/lyrics', { title: artistaL + tituloL }));
        const json = await res.json();
        let img;
        try {
            img = result.album.artwork;
        } catch {
            try {
                img = json.thumbnail.genius;
            } catch {
                try {
                  const bochil = await googleImage(`${artistaL} ${tituloL}`);
                  img = await bochil.getRandom();
                } catch {    
                  img = lyrics.image;   
                }
            }
        }

        const previewUrl = result[0]?.preview.replace('http://cdn-preview-', 'https://cdns-preview-').replace('.deezer.com', '.dzcdn.net');

        const textoLetra = `*Título:* ${tituloL || ''}\n*Artista:* ${artistaL || ''}\n\n*Letra:* \n${lyrics.lyrics || 'No se encontraron letras.'}`;
        await conn.sendMessage(m.chat, { image: { url: img }, caption: textoLetra }, { quoted: m });
        await conn.sendMessage(m.chat, { audio: { url: previewUrl }, fileName: `${artistaL || '-'} - ${tituloL || '-'}.mp3`, mimetype: 'audio/mp4' }, { quoted: m });
    } catch (e) {
        console.log(`Error: ${e.message}`)
        throw `*Error al obtener la información.*`;
    }
};

handler.help = ['lirik', 'letra'].map((v) => v + ' <Nombre de la canción>');
handler.tags = ['internet'];
handler.command = /^(lirik|lyrics|lyric|letra)$/i;
export default handler;

async function searchLyrics(term) {
  try {
    if (!term) return "🟥 Proporciona el nombre de la canción para buscar la letra";
    const geniusResponse = await axios.get(`https://apilyrics.vercel.app/genius?query=${term}`);
    const geniusData = geniusResponse.data;
    if (!geniusData.length) return `🟨 No se encontraron letras para "${term}"`;
    const lyricsUrl = geniusData[0].url;
    const lyricsResponse = await axios.get(`https://apilyrics.vercel.app/lyrics?url=${lyricsUrl}`);
    const result = {
      status: '200',
      creador: 'Sareth',
      title: geniusData[0].title || "",
      fullTitle: geniusData[0].fullTitle || "",
      artist: geniusData[0].artist.name || "",
      artistUrl: geniusData[0].artist.url || "",
      id: geniusData[0].id || "",
      enpoint: geniusData[0].endpoint || "",
      instrumental: geniusData[0].instrumental,
      image: geniusData[0].image || "",
      url: geniusData[0].url || "",
      lyrics: lyricsResponse.data.lyrics || "",
    };
    return result;
  } catch (error) {
    console.error(error.message);
    return {
      creador: "Sareth",
      status: "error",
      message: new Error(error).message,
    };
  }
}
