import fetch from 'node-fetch';

const handler = async (m, { text }) => {
  if (!text) throw 'Please provide the song title or the format: song title - artist';

  // Parse the song title and artist if available
  const [songTitle, artist] = text.includes('-') ? text.split(' - ').map(v => v.trim()) : [text, null];

  // Construct the search query
  const searchQuery = artist ? `${songTitle} ${artist}` : songTitle;

  // Fetch song data from iTunes API
  const apiUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&entity=song&limit=1`;
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
    price: song.trackPrice ? `${song.trackPrice} ${song.currency}` : 'Price not available',
    description: song.longDescription || song.shortDescription || 'No description available',
  };

  // Fetch reviews from a web source (e.g., YouTube or Reddit)
  const reviewQuery = `${songInfo.title} ${songInfo.artist} review`;
  const reviewApiUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(reviewQuery)}&limit=1&type=link`;
  const reviewResponse = await fetch(reviewApiUrl);
  const reviewData = await reviewResponse.json();

  let reviewText = 'No reviews found';
  if (reviewData && reviewData.data && reviewData.data.children.length > 0) {
    reviewText = reviewData.data.children[0].data.selftext || reviewData.data.children[0].data.title;
  }

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

📝 *Review:* ${reviewText}
  `;

  // Send the message
  m.reply(message);
};

handler.help = ['musicinfo'].map(v => v + ' <song title> - <artist>');
handler.tags = ['music'];
handler.command = /^(musicinfo)$/i;

export default handler;
