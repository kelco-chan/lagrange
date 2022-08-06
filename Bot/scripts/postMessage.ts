import { request } from "https";
import * as dotenv from 'dotenv';
dotenv.config()

// Registers all commands
async function main(){
    let req = request({
        hostname:"discord.com",
        path:`/api/v10/channels/1003945203712929792/messages`,
        method:"POST",
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
    req.write(JSON.stringify({
        content:"Click on the button below to verify yourself:",
        components:[
            {
                type:1,
                components:[
                    {
                        type: 2,
                        style: 1,
                        label: "Verify",
                        custom_id:"VERIFY"
                    }
                ]
            }
        ]
    }));
    req.end();
    req.on("error", e=> console.log(e))
}
main();