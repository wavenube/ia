import fetch from 'node-fetch';

const handler = async (m, { text }) => {
  if (!text) throw 'Please provide the song title and artist in the format: song title - artist';

  // Parse the song title and artist
  const [songTitle, artist] = text.split(' - ').map(v => v.trim());
  if (!songTitle || !artist) throw 'Invalid format. Use the format: song title - artist';

  // Fetch song data from iTunes API
  const apiUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(songTitle)}+${encodeURIComponent(artist)}&entity=song&limit=1`;
  const response = await fetch(apiUrl);
  const data = await response.json();

  if (!data.results || !data.results.length) throw 'Song not found';

  const song = data.results[0];

  // Extract necessary details
  const songInfo = {
    title: song.trackName,
    artist: song.artistName,
    album: song.collectionName || 'Unknown album',
    releaseDate: song.releaseDate ? new Date(song.releaseDate).toLocaleDateString() : 'Unknown release date',
    duration: song.trackTimeMillis ? `${Math.floor(song.trackTimeMillis / 60000)}:${((song.trackTimeMillis % 60000) / 1000).toFixed(0)}` : 'Unknown duration',
    genre: song.primaryGenreName || 'Unknown genre',
    likes: 'N/A',  // Likes/Dislikes are generally not available through iTunes API
    dislikes: 'N/A',
    description: song.longDescription || song.shortDescription || 'No description available',
    price: song.trackPrice ? `${song.trackPrice} ${song.currency}` : 'Price not available'
  };

  // Construct the response message
  const message = `
🎵 *Title:* ${songInfo.title}
👤 *Artist:* ${songInfo.artist}
💽 *Album:* ${songInfo.album}
📅 *Release Date:* ${songInfo.releaseDate}
⏳ *Duration:* ${songInfo.duration}
🎼 *Genre:* ${songInfo.genre}
💬 *Description:* ${songInfo.description}
💰 *Price:* ${songInfo.price}
  `;

  // Send the message
  m.reply(message);
};

handler.help = ['musicinfo'].map(v => v + ' <song title> - <artist>');
handler.tags = ['music'];
handler.command = /^musicinfo$/i;

export default handler;
