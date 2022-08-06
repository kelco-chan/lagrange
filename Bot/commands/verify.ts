import { SlashCommandBuilder } from "@discordjs/builders";
import { APIInteraction, APIInteractionResponse, ApplicationCommandType, InteractionResponseType, InteractionType } from "discord-api-types/v10"
import { rest } from "../utils";
export const builder = new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Run this commands to get verified")
    .addStringOption(option => option
        .setName("firstname")
        .setDescription("Your first name.")
        .setRequired(true))
    .addStringOption(option => option
        .setName("state")
        .setDescription("The state that you come from")
        .setRequired(true)
        .setChoices(
            {name: "New South Wales", value:"NSW"},
            {name: "Victoria", value:"VIC"},
            {name: "South Australia", value:"SA"},
            {name: "Queensland", value:"QLD"},
            {name: "Western Australia", value:"WA"},
            {name: "Australian Capital Territory", value:"ACT"},
            {name: "Northern Territory", value:"NT"},
            {name: "Tasmania", value:"TA"}
        ))
    .addStringOption(option => option
        .setName("cohourt")
        .setDescription("The cohourt/year of JSO that you are in")
        .setRequired(true)
        .setChoices(
            {name:"2021", value: "2021"},
            {name:"2022", value: "2022"}
        ))
    .addStringOption(option => option
        .setName("discipline")
        .setDescription("The aspect of high-school science that you are the best at")
        .setRequired(true)
        .setChoices(
            {name:"🌿 Biology", value: "bio"},
            {name:"🧪 Chemistry", value: "chem"},
            {name:"🌠 Physics", value:"phys"}
        ))
const COHOURT_ROLES = {
    2021: "1003596283648409732",
    2022: "997054206483628083"
}
const DISCIPLINE_ROLES = {
    "phys": "1005414027708616776",
    "chem": "1005414066317164604",
    "bio": "1005414109468180560"
}
export const handlers = [
    async function(body: APIInteraction): Promise<APIInteractionResponse>{
        if(body.type !== InteractionType.ApplicationCommand) return;
        if(body.data.name !== "verify") return;
        if(body.data.type !== ApplicationCommandType.ChatInput) return;
        if(!body.member) return;
        if(body.member.roles.includes("1003596283648409732") || body.member.roles.includes("997054206483628083")){
            return {
                type: 4,
                data:{
                    embeds:[{
                        title: "You are already verified",
                        description: "Sorry, but you cannot verify twice on this server."
                    }]
                }
            }
        }
        let options = body.data.options as {name: string, value:string}[];
        let nickname:string = "";
        let roles = [];
        for(let {name, value} of options){
            if(name === "firstname"){
                nickname += value;
            }else if(name === "cohourt"){
                roles.push(COHOURT_ROLES[value]);
            }else if(name === "discipline"){
                roles.push(DISCIPLINE_ROLES[value])
            }else if(name === "state"){
                nickname += ` (${value})`
            }
        }
        await rest("PATCH", `/guilds/${body.guild_id}/members/${body.member.user.id}`, {
            nick: nickname,
            roles: [...body.member.roles, ...roles]
        });
        return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                embeds:[{
                    title:"Verified!",
                    description:"Welcome to Potato Island. If you are new to JSO, make sure to say hi in <#980418817656250388>!"
                }],
                flags: 64
            }
        }

    }
]