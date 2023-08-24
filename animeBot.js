const { create, decryptMedia } = require('@open-wa/wa-automate');
const axios = require('axios');

const prefix = '/';

const searchAnime = async (query) => {
  const searchUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&sfw`;

  try {
    const response = await axios.get(searchUrl);
    const results = response.data.data.map((result) => ({
      title: result.title,
      type: result.type,
      score: result.score,
      synopsis: result.synopsis,
      url: result.url,
      imageUrl: result.images.jpg.image_url,
    }));

    return results;
  } catch (error) {
    console.error('Error in searchAnime:', error);
  }
};

const searchManga = async (query, type) => {
  const searchUrl = `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(searchUrl);
    const results = response.data.data.filter(result => result.type.toLowerCase() === type.toLowerCase())
      .map((result) => ({
        title: result.title,
        type: result.type,
        score: result.score,
        synopsis: result.synopsis,
        url: result.url,
        imageUrl: result.images.jpg.image_url,
      }));

    return results;
  } catch (error) {
    console.error('Error in searchManga:', error);
  }
};

const getAnimeInfo = async (query) => {
  console.log('Query received:', query); // Log the query

  const results = await searchAnime(query);

  console.log('Results from searchAnime:', results); // Log the results

  if (results.length > 0) {
    const { title, type, score, synopsis, url, imageUrl } = results[0];

    return {
      title,
      type,
      score,
      synopsis,
      url,
      imageUrl,
    };
  }

  return null;
};

const getMangaInfo = async (query, type) => {
  console.log('Query received:', query); // Log the query

  const results = await searchManga(query, type);

  console.log('Results from searchManga:', results); // Log the results

  if (results.length > 0) {
    const { title, type, score, synopsis, url, imageUrl } = results[0];

    return {
      title,
      type,
      score,
      synopsis,
      url,
      imageUrl,
    };
  }

  return null;
};

create().then((client) => {
  console.log('Bot has started!');

  client.onMessage(async (message) => {
    console.log('Message received from WhatsApp:', message.body); // Log the received message

    if (message.body.startsWith(prefix + 'anime')) {
      const query = message.body.substring(7).trim();
      const animeInfo = await getAnimeInfo(query);

      if (animeInfo) {
        const { title, type, score, synopsis, url, imageUrl } = animeInfo;
        const messageBody = `
          *Title:* ${title}
          *Type:* ${type}
          *Score:* ${score}
          *Synopsis:*
          ${synopsis}
          *URL:* ${url}
        `;

        if (imageUrl) {
          const media = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          const base64Data = Buffer.from(media.data, 'binary').toString('base64');
          const image = `data:${media.headers['content-type']};base64,${base64Data}`;
          await client.sendImage(message.from, image, 'anime-poster.jpg', messageBody);
        } else {
          await client.sendText(message.from, messageBody);
        }
      } else {
        await client.sendText(message.from, 'No anime found with that query!');
      }
    } else if (message.body.startsWith(prefix + 'manga')) {
      const query = message.body.substring(7).trim();
      const mangaInfo = await getMangaInfo(query, 'Manga');

      if (mangaInfo) {
        const { title, type, score, synopsis, url, imageUrl } = mangaInfo;
        const messageBody = `
          *Title:* ${title}
          *Type:* ${type}
          *Score:* ${score}
          *Synopsis:*
          ${synopsis}
          *URL:* ${url}
        `;

        if (imageUrl) {
          const media = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          const base64Data = Buffer.from(media.data, 'binary').toString('base64');
          const image = `data:${media.headers['content-type']};base64,${base64Data}`;
          await client.sendImage(message.from, image, 'manga-cover.jpg', messageBody);
        } else {
          await client.sendText(message.from, messageBody);
        }
      } else {
        await client.sendText(message.from, 'No manga found with that query!');
      }
    } else if (message.body.startsWith(prefix + 'manwha')) {
      const query = message.body.substring(8).trim();
      const mangaInfo = await getMangaInfo(query, 'Manhwa');

      if (mangaInfo) {
        const { title, type, score, synopsis, url, imageUrl } = mangaInfo;
        const messageBody = `
          *Title:* ${title}
          *Type:* ${type}
          *Score:* ${score}
          *Synopsis:*
          ${synopsis}
          *URL:* ${url}
        `;

        if (imageUrl) {
          const media = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          const base64Data = Buffer.from(media.data, 'binary').toString('base64');
          const image = `data:${media.headers['content-type']};base64,${base64Data}`;
          await client.sendImage(message.from, image, 'manwha-cover.jpg', messageBody);
        } else {
          await client.sendText(message.from, messageBody);
        }
      } else {
        await client.sendText(message.from, 'No manwha found with that query!');
      }
    } else if (message.body.startsWith(prefix + 'novel')) {
      const query = message.body.substring(7).trim();
      const mangaInfo = await getMangaInfo(query, 'Light Novel');

      if (mangaInfo) {
        const { title, type, score, synopsis, url, imageUrl } = mangaInfo;
        const messageBody = `
          *Title:* ${title}
          *Type:* ${type}
          *Score:* ${score}
          *Synopsis:*
          ${synopsis}
          *URL:* ${url}
        `;

        if (imageUrl) {
          const media = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          const base64Data = Buffer.from(media.data, 'binary').toString('base64');
          const image = `data:${media.headers['content-type']};base64,${base64Data}`;
          await client.sendImage(message.from, image, 'novel-cover.jpg', messageBody);
        } else {
          await client.sendText(message.from, messageBody);
        }
      } else {
        await client.sendText(message.from, 'No novel found with that query!');
      }
    }
  });
}).catch((error) => {
  console.error('Error in create:', error);
});
