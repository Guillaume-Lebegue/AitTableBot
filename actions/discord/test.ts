import { createSlashCommand, InteractionCommandPayload, SlashCommandOptionType } from "https://deno.land/x/discordeno@10.0.1/mod.ts";
import { Reunion, ReunionStatus } from "../../models/reunion.ts";
import sendNotif from './sendNotifTomorow.ts';

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

    const reu: Reunion[] = [{
        createdTime: new Date,
        id: 'ikjfioujaqe',
        fields: {
            Date: new Date(2021, 1, 10, 14, 30),
            Name: 'Test reunion',
            Status: ReunionStatus.coming,
            Lien: 'https://www.youtube.com/watch?v=Wmtp2HQku9M&list=PLVmM0UVcquYKTdfVVy54fsWEWDEKhFT5h&index=3',
        }
    },{
        createdTime: new Date,
        id: 'ikjfioujaqe',
        fields: {
            Date: new Date(2021, 1, 10, 15, 30),
            Name: 'Test reunion2',
            Status: ReunionStatus.coming,
            Lien: 'https://www.youtube.com/watch?v=Wmtp2HQku9M&list=PLVmM0UVcquYKTdfVVy54fsWEWDEKhFT5h&index=3',
        }
    }];

    await sendNotif(reu);
}