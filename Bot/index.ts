import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { verifyKey } from "discord-interactions";
import * as dotenv from 'dotenv';
import { getCommands } from "./commands";
dotenv.config()
let commands;
getCommands().then(cmds => commands = cmds);
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    if(req.method !== "POST"){
        context.res = {
            status: 405,
            body: {message:"Only POST requests are allowed."}
        }
        return;
    }
    //check signature
    const signature = req.headers['x-signature-ed25519'];
    const timestamp = req.headers['x-signature-timestamp'];
    const isValidRequest = verifyKey(
        req.rawBody,
        signature,
        timestamp,
        process.env.PUBLIC_KEY
    );
    if(!isValidRequest){
        context.res = {
            status: 401,
            body:{
                error:"Invalid signature."
            }
        };
        return;
    }
    if(req.body.type === 1){
        context.res = {body:{type: 1}};
        return;
    }
    for(let command of commands){
        for(let handler of command.handlers){
            let res = await handler(req.body);
            if(res){
                context.res = {
                    body:res,
                    headers: {
                        "Content-Type":"application/json",
                    }
                };
                return;
            }
        }
    }
    return;
};

export default httpTrigger;