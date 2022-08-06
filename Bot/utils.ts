import { request } from "https";

export function rest(method: string, endpoint: string, payload: any){
    return new Promise<{status: number, body: any}>((resolve, reject) => {
        let req = request({
            hostname:"discord.com",
            path:`/api/v10${endpoint}`,
            method,
            headers:{
                "Authorization": `Bot ${process.env.BOT_TOKEN}`,
                "Content-Type": "application/json"
            }
        }, res => {
            let d = ""
            res.on("data", _d => d+=_d);
            res.on("end", () => resolve({status: res.statusCode, body:JSON.stringify(d)}));
        });
        req.write(JSON.stringify(payload));
        req.end();
        req.on("error", reject)
    })
}