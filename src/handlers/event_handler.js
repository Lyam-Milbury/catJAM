const path = require('path');
const fs = require('fs');

module.exports = (client, Discord) =>{
    const load_dir = (dirs) =>{
        const dir = path.resolve('\src','\events', `${dirs}`);
        const events_files = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
        for(const file of events_files){
            let eventDir = path.resolve(`${dir}`,`${file}`);
            const event = require(eventDir);
            const event_name = file.split('.')[0];
            client.on(event_name, event.bind(null, Discord, client));
        }
    }

    ['client', 'guild'].forEach(e => load_dir(e));
}