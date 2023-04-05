const path = require('path');
const fs = require('fs');

module.exports = (client) =>{
    const load_dir = () =>{

        const dir = path.resolve('\src','\events');
        const events_files = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
        for(const file of events_files){
            const filePath = path.join(dir, file);
            const event = require(filePath);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
        }
    }

    load_dir();
}