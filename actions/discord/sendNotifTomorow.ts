import { Reunion } from "../../models/reunion.ts";
import { Embed, sendMessage } from "https://deno.land/x/discordeno@10.0.1/mod.ts";
import * as DiscordDb from '../../services/discordDB.ts';
import { format } from "https://deno.land/std@0.83.0/datetime/mod.ts";

export default async function (reunions: Reunion[]) {
    const guilds = await DiscordDb.findAll();

    guilds.forEach(async guild => {
        if (!guild.channelNotifId || !guild.roleNotifId)
            return;

        const rolePing = `<@&${guild.roleNotifId}>`;
        const embed: Embed = {
            title: `Les rendez-vous de demain`,
            fields: []
        }

        reunions.forEach(reu => {
            const time = format(reu.fields.Date, 'HH:mm');
            embed.fields?.push({
                name: reu.fields.Name,
                value: time,
                inline: true
            });
        })

        await sendMessage(guild.channelNotifId, {
            content: rolePing,
            embed
        });
    })
}