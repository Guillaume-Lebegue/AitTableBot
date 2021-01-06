import { createSlashCommand, InteractionCommandPayload, Message, SlashCommandOptionType } from "https://deno.land/x/discordeno@10.0.1/mod.ts";
import { createGuild } from './discordDB.ts';

import setupGuildAction from '../actions/discord/setupGuild.ts';
import testAction from '../actions/discord/test.ts';
import setNotifAction from '../actions/discord/setNotif.ts';

const commands: { [id: string] : (inter: InteractionCommandPayload) => unknown} = {
    'setup': setupGuildAction,
    'test': testAction,
    'setnotif': setNotifAction
}

const setup = () => {
    console.log('Setup discord bot');
    createSlashCommand({
        name: 'setup',
        description: 'Setup this bot in this guild'
    });
}

export const setupGuild = async (guildID: string) => {
    console.log('Setup bot for guild ' + guildID);

    try {
        await createGuild({guildID: guildID})
    } catch(err) {
        if (err.message != 'Already exist')
            console.error('Setup guild: ', err);
    }

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

export const onReady = () => {
    console.log('Discord bot ready');
    setup();
}

export const onMessageCreate = (message: Message) => {
}

export const onInteractionCreate = (data: InteractionCommandPayload) => {
    if (!data.data)
        return;

    if (commands[data.data.name])
        return commands[data.data.name](data);

    console.log('Unknown interaction: ', data);
}