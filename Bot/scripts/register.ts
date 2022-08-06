import { request } from "https";
import { getCommands } from "../commands";
import * as dotenv from 'dotenv';
dotenv.config()

// Registers all commands
async function main(){
    let cmds = await getCommands();
    let req = request({
        hostname:"discord.com",
        path:`/api/v10/applications/${process.env.APPLICATION_ID}/guilds/${process.env.GUILD_ID}/commands`,
        method:"PUT",
        headers:{
            "Authorization": `Bot ${process.env.BOT_TOKEN}`,
            "Content-Type": "application/json"
        }
    }, res => {
        console.log(res.statusCode)
        let d = ""
        res.on("data", _d => d+=_d);
        res.on("end", () => console.log(d));
    });
    req.write(JSON.stringify(cmds.map(cmd => cmd.builder.toJSON())));
    req.end();
    req.on("error", e=> console.log(e))
}
main();