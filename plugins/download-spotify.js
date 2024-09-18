const axios = require('axios');

// Función para descargar música de Spotify
async function spotifyDownloader(url) {
    const apiUrl = `https://deliriusapi-official.vercel.app/download/spotifydl?url=${url}`;

    try {
        const response = await axios.get(apiUrl);

        // Validar que la respuesta contiene la URL de descarga
        if (response.data && response.data.downloadUrl) {
            return {
                title: response.data.title,
                downloadUrl: response.data.downloadUrl
            };
        } else {
            throw new Error("No se pudo obtener el enlace de descarga.");
        }
    } catch (error) {
        console.error("Error al descargar la canción de Spotify:", error);
        return null;
    }
}

// Comando .spotify para descargar canciones
const handler = async (message, { client, args }) => {
    if (args.length === 0) {
        await client.sendMessage(message.chatId, 'Por favor, proporciona una URL válida de Spotify.');
        return;
    }

    const spotifyUrl = args[0]; // La URL de Spotify es el primer argumento

    // Descargar la canción usando la API
    const songInfo = await spotifyDownloader(spotifyUrl);

    if (songInfo) {
        // Enviar el título de la canción y el enlace de descarga
        await client.sendMessage(
            message.chatId,
            `🎵 *Título*: ${songInfo.title}\n🔗 *Enlace de descarga*: ${songInfo.downloadUrl}`
        );
    } else {
        // Enviar mensaje de error si no se pudo descargar
        await client.sendMessage(message.chatId, 'Hubo un error al intentar descargar la canción de Spotify. Intenta de nuevo más tarde.');
    }
};

// Añadir la estructura que mencionaste:
handler.help = ['spotify']; // Añadir a la lista de comandos de ayuda
handler.tags = ['tools'];  // Categoría del comando
handler.command = /^(spotify)$/i; // Comando regex

module.exports = handler; // Exportar el módulo correctamente
