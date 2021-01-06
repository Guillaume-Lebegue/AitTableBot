import { Reunion } from "../../models/reunion.ts";
import { sendMessage } from "https://deno.land/x/discordeno@10.0.1/mod.ts";
import * as DiscordDb from '../../services/discordDB.ts';
import { format } from "https://deno.land/std@0.83.0/datetime/mod.ts";

export default async function (reunion: Reunion) {
    const guilds = await DiscordDb.findAll();

    guilds.forEach(async guild => {
        if (!guild.channelNotifId || !guild.roleNotifId)
            return;

        const rolePing = `<@&${guild.roleNotifId}>`;
        const time = format(reunion.fields.Date, 'HH:mm');

        await sendMessage(guild.channelNotifId, `${rolePing} Rendez-vous aujourd'hui à ${time} pour \`${reunion.fields.Name}\`, rendez-vous sur ${reunion.fields.Lien}`);
    })
}