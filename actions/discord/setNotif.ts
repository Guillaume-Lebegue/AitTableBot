import { cache, Channel, ChannelTypes, createSlashCommand, executeSlashCommand, InteractionCommandPayload, InteractionResponseType, Role, SlashCommandOptionType } from "https://deno.land/x/discordeno@10.0.1/mod.ts";
import * as DiscordDb from '../../services/discordDB.ts';
import type * as DbType from '../../models/discord.ts';

export const setup = function(guildID: string) {
    createSlashCommand({
        name: 'setnotif',
        description: 'Set channel and role for notification',
        guildID,
        options: [
            {
                type: SlashCommandOptionType.CHANNEL,
                name: 'channel',
                description: 'Channel where the notification will be set',
                required: true
            }, {
                type: SlashCommandOptionType.ROLE,
                name: 'role',
                description: 'Role to ping with notification',
                required: true
            }
        ]
    })
}

export const execute = async function (inter: InteractionCommandPayload) {
    var refusedReason: string | undefined;
    var channel: Channel | undefined;
    var role: Role | undefined;
    const guild = cache.guilds.get(inter.guild_id);
    const channelId = inter.data?.options.find((value) => value.name == 'channel')?.value?.toString();
    const roleId = inter.data?.options.find((value) => value.name == 'role')?.value?.toString();

    if (!channelId)
        refusedReason = 'Bad channel';
    if (!refusedReason && !roleId)
        refusedReason = 'Bad role';
    if (!refusedReason && !guild)
        refusedReason = 'Guild not found';

    if (!refusedReason) {
        channel = guild?.channels.get(channelId as string);
        role = guild?.roles.get(roleId as string);

        if (!channel)
            refusedReason = 'Channel not found in guild';
        if (!refusedReason && !role)
            refusedReason = 'Role not found in guild';
        if (!refusedReason && channel?.type != ChannelTypes.GUILD_NEWS &&
                channel?.type != ChannelTypes.GUILD_TEXT)
            refusedReason = 'Channel is of invalid type';
        if (!refusedReason && !role?.mentionable)
            refusedReason = 'Role is not mentionable';
    }

    if (!refusedReason) {
        try {
            await DiscordDb.updateByGuildId(inter.guild_id, {
                channelNotifId: channelId,
                roleNotifId: roleId
            });
        } catch(err) {
            if (err == 'Not found')
                refusedReason = 'Guild not setup';
            else {
                refusedReason = 'Server error';
                console.error('Getting guild on setNotif', err);
            }
        }
    }

    if (refusedReason) {
        executeSlashCommand(inter.id, inter.token, {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: 'Refused: ' + refusedReason
            }
        })
        return;
    }

    executeSlashCommand(inter.id, inter.token, {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `Accepted, now sending notification to channel \`#${channel?.name}\`, while tagging role \`@${role?.name}\``
        }
    })
}