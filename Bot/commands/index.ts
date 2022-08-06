import { readdir } from "fs/promises";
import { join } from "path";
// This file is NOT A COMMAND. Instead, it returns the list of all commands.
let commands = [];
export async function getCommands(){
    if(commands.length === 0){
        let files = await readdir(__dirname);
        for(let file of files){
            if(file === "index.js" || (!file.endsWith(".js")) || (file.indexOf("_") != -1)) continue;
            commands.push(await import(join(__dirname, file)));
        }
    }
    return commands;
}