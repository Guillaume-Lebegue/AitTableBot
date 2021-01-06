import { InteractionCommandPayload, Message } from "https://deno.land/x/discordeno@10.0.1/mod.ts";
import { createGuild } from './discordDB.ts';

import * as setupGuildAction from '../actions/discord/setupGuild.ts';
import * as testAction from '../actions/discord/test.ts';
import * as setNotifAction from '../actions/discord/setNotif.ts';
import * as addRecurentAction from '../actions/discord/addRecurent.ts';
import * as addReunionAction from '../actions/discord/addReunion.ts';

interface GuildCmd {
    execute: (inter: InteractionCommandPayload) => unknown,
    setup: (guildID: string) => unknown
}

interface GlobalCMD {
    execute: (inter: InteractionCommandPayload) => unknown,
    setup: () => unknown
}

const globalCommands: { [id: string] : GlobalCMD} = {
    'setup': setupGuildAction,
}

const guildCommands: { [id: string] : GuildCmd} = {
    'test': testAction,
    'setnotif': setNotifAction,
    'addrecurent': addRecurentAction,
    'addreunion': addReunionAction
}

const setup = () => {
    console.log('Setup discord bot');
    
    for (var key in globalCommands)
        globalCommands[key].setup();
}

export const setupGuild = async (guildID: string) => {
    console.log('Setup bot for guild ' + guildID);

    try {
        await createGuild({guildID: guildID})
    } catch(err) {
        if (err.message != 'Already exist')
            console.error('Setup guild: ', err);
    }

    for (var key in guildCommands)
        guildCommands[key].setup(guildID);
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

    if (guildCommands[data.data.name])
        return guildCommands[data.data.name].execute(data);

    if (globalCommands[data.data.name])
        return globalCommands[data.data.name].execute(data);

    console.log('Unknown interaction: ', data);
}