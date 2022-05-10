# catJAM

catJAM is a Node.js based music playing Discord bot capable of delivering high quality music to multiple Discord servers at once. This bot was built as a personal project with security and scalability in mind. It makes use of [discord.js](https://discord.js.org/), [FFMPEG](https://ffmpeg.org/), and yt-dl to retrieve Youtube videos, isolate their audio, and stream it directly to a voice channel at the request of a user.

## Requirements
This bot was made and hosted on an Ubuntu EC2 AWS server for maximum uptime. The Ubuntu version of the server is 20.04.3 LTS, so it should work with newer versions of Ubuntu and other Ubuntu-based distros, but it has not been tested. This readme will focus on installing and hosting the bot on Linux platforms.

Due to most VOIP features having been deprecated from the Discord.js library, older versions of most libraries had to be used in order to get the bot to function as intended. Because of this, we settled on version 14.16.1 of Node.js to ensure compatibility with . This was installed using the Node Version Manager, a guide for installing nvm can be found [here](https://gist.github.com/d2s/372b5943bce17b964a79). After installing nvm, update (or degrade) Node.js using the following command:

- `nvm install v14.16.1`

The Node Package Manager (npm) is required. The version used for this project is version 6.14.12 and can be installed using:

- `npm install -g npm@6.14.12`

## Install

To begin the installation process, some housekeeping needs to be done in advance. First, we have to install the most recent version of FFMPEG (4.2.4 as of May 2022), which can be done using:

- `sudo apt install ffmpeg`

To ensure the process is daemonized, we made use of [PM2](https://pm2.keymetrics.io/), a lightweight process manager for Node.js applications. The latest version (5.1.2 as of May 2022) can be installed with the following command:

- `npm install pm2 -g`

After this, the GitHub repo can be pulled and the remaining dependencies can be installed from the *packages.json* file using `install npm` within the *catJAM* folder.

## Running the bot

With all the prerequisites taken care of, we can now host the bot. If you want use this code for your own bot, the only change that needs to be made is in the [main.js](src/main.js) file. 
```ts
//Client login using an environment variable for the api key
client.login(process.env.YOUR_KEY_HERE);
```
The API key should be changed to the API key of your bot. We suggest setting the API key as an environment variable for security purposes.

From here, we can run the bot by navigating to the *catJAM* folder and typing the following into the command line:

- `pm2 start .`

The bot should now be online and ready to use.

## Commands

Once the bot is online, the following commands can be used:
- **!play/!p X** : Plays audio from the given Youtube link *X*, or uses inputted keywords from *X* to search for the most relevant video and plays its audio.
- **!skip/!s**: Skips currently playing audio
- **!stop** : Stops currently playing audio and clears the queue
- **!pause** : Pauses currently playing audio
- **!resume** : Resumes currently playing audio
- **!queue/!q** : Returns the songs currently in queue and their positions in the queue
- **!remove/!r Y** : Removes song Y from the queue, where Y is the position of the song in the queue


## Future plans
As of May 2022:
1. Implementing Spotify song/playlist link compatibility
