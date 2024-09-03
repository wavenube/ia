import fetch from 'node-fetch';
import cheerio from 'cheerio';
import puppeteer from 'puppeteer';

// Function to search for email/username/phone info across platforms
const handler = async (m, { text }) => {
    let query = text.trim();
    if (!query) return m.reply('Please provide an email, username, or phone number to search.');

    m.reply(`Searching for information on: ${query}...`);

    // Use puppeteer or cheerio for scraping information
    // Example using puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
    const content = await page.content();

    const $ = cheerio.load(content);
    let platforms = [];

    // Use Cheerio to parse the scraped content for platform info
    $('a').each((i, element) => {
        const link = $(element).attr('href');
        if (link.includes('youtube.com') || link.includes('instagram.com') || link.includes('facebook.com')) {
            platforms.push(link);
        }
    });

    await browser.close();

    if (platforms.length === 0) {
        return m.reply(`No platforms found for: ${query}`);
    }

    let resultMessage = `Platforms found for ${query}:\n\n`;
    resultMessage += platforms.join('\n');

    m.reply(resultMessage);
};

// Set command attributes
handler.help = ['getinfo'];
handler.tags = ['search'];
handler.command = /^getinfo$/i; // Triggered by .getinfo

export default handler;
