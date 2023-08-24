const { create, Client } = require('@open-wa/wa-automate');
const qrcode = require('qrcode');

const jikanjs = require('jikanjs');

create().then((client) => {
  client.onStateChanged((state) => {
    if (state.qrCode) {
      qrcode.generate(state.qrCode, { small: true }, (qr) => {
        console.log(qr);
      });
      require('open')('http://localhost:3000');
    }
  });

  client.onMessage(async (message) => {
    if (message.body.startsWith('/anime ')) {
      const animeName = message.body.substring(7);
      try {
        const anime = await jikanjs.search('anime', animeName);
        const animeInfo = await jikanjs.loadAnime(anime.results[0].mal_id);
        const response = `*${animeInfo.title}*\n\n${animeInfo.synopsis}\n\n*Type:* ${animeInfo.type}\n*Episodes:* ${animeInfo.episodes}\n*Score:* ${animeInfo.score}\n\n${animeInfo.image_url}`;
        await client.sendText(message.from, response);
      } catch (error) {
        console.error(error);
        await client.sendText(message.from, 'An error occurred while fetching anime information. Please try again later.');
      }
    }
  });
}).catch((error) => {
  console.error('Error:', error);
});
