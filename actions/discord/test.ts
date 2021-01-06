import { createSlashCommand, InteractionCommandPayload, SlashCommandOptionType } from "https://deno.land/x/discordeno@10.0.1/mod.ts";
import createRecurent from '../airTable/createRecurent.ts';

export const setup = function (guildID: string) {
    createSlashCommand({
        name: 'test',
        description: 'test cmd',
        guildID,
        options: [
            {
                type: SlashCommandOptionType.STRING,
                name: 'message',
                description: 'Message to test'
            }
        ]
    })
}

export const execute = async function (inter: InteractionCommandPayload) {
    console.log('Got command test');
    //console.log('got command test, with message: ' + inter.data?.options[0].value);

    await createRecurent();
}