# GitHub-Follow-Track
Track GitHub Followers and send discord messages on new followers and unfollows

## Usage
- Glone repo to a server or where it's gonna stay up and running
- Do `npm ci` to install dependencies
- Run `npm run generate-config` to generate a config
- Create [a discord webhook](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks) on a channel where you want to receive the updates
- Edit the config in `config/config.custom.js`
  - Add your GitHub username to `user`
  - Add your discord webhook link to `discord_webhook`
- Run using `npm start`
  - Or using [pm2](https://pm2.keymetrics.io/): `pm2 start src/app.js`
- Done
