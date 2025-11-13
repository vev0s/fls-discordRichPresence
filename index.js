const discord = require('discord-rpc');
const winprocess = require("node-process-windows");
const clientId = 'CLIENT_ID';

discord.register(clientId);

let startTimestamp = new Date();

let rpc = new discord.Client({
    transport: 'ipc'
});

function proc(){
    let activeProcesses = winprocess.getProcesses(function(err, processes) {
        let flProcess = processes.filter(p => p.processName.indexOf("FL64") >= 0);

        if(!flProcess){
            console.log("Something goes wrong. FL Studio is running ?");
            rpc.destroy();
            return;
        }   
        else if(flProcess[0].processName === "FL64" || flProcess[0].processName === "FL"){
            let title = flProcess[0].mainWindowTitle.split(' - ');
            console.log(title);

            if(title[0] === "FL Studio 20"){
                projectTitle = "Unsaved Project";
            }
            else {
                projectTitle = title[0];
            }
    
            rpc.setActivity({
                details: `Editing : ${projectTitle}`,
                startTimestamp,
                largeImageKey: 'logo_black',
                largeImageText: "FL Studio 20",
                instance: false,
            });
        }
    });
}

rpc.on('ready', () => {
    console.log(`Starting with clientID ${clientId}`);
    proc();
    setInterval(() => {
        console.log("Updated at " + startTimestamp);
        let a = proc();
    }, 30000);
});


rpc.login({ clientId }).catch(console.error);
