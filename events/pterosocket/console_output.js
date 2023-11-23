const { appendFile } = require('fs');

module.exports = {
    name: "console_output",
    async run(client, output) {
        appendFile("consolehistory.txt", `${output}\n`, (err) => { 
            if (err) console.log(err); 
        }); 
    }
};