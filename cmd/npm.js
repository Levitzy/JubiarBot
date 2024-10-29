// cmd/npm.js
const https = require('https');
const { sendTextMessage } = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
  name: 'npm',
  description: 'Fetch information about an npm package from the Popcat API',

  execute: async (userId, args) => {
    if (!args.length) {
      return sendTextMessage(userId, "Please provide a package name to search for.");
    }

    const packageName = args.join(" ");
    const url = `https://api.popcat.xyz/npm?q=${encodeURIComponent(packageName)}`;

    https.get(url, (response) => {
      let data = '';

      // Collect the data
      response.on('data', (chunk) => {
        data += chunk;
      });

      // Process the data
      response.on('end', () => {
        try {
          const packageInfo = JSON.parse(data);

          if (packageInfo.error) {
            sendTextMessage(userId, `No results found for "${packageName}".`);
          } else {
            const formattedMessage = `
*Package Name:* ${packageInfo.name}
*Version:* ${packageInfo.version}
*Description:* ${packageInfo.description}
*Author:* ${packageInfo.author}
*Repository:* ${packageInfo.repository || "N/A"}
*Downloads:* ${packageInfo.downloads}
*Maintainers:* ${packageInfo.maintainers}
*Last Updated:* ${packageInfo.last_updated}

*Link:* ${packageInfo.link}
            `;

            sendTextMessage(userId, formattedMessage.trim());
          }
        } catch (error) {
          console.error(error);
          sendTextMessage(userId, "An error occurred while fetching package data.");
        }
      });
    }).on('error', (error) => {
      console.error(error);
      sendTextMessage(userId, "An error occurred while trying to fetch data.");
    });
  },
};
