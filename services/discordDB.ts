import type { Guild, UpdateGuild } from '../models/discord.ts';
import { db } from './dateBase.ts';

const dataBase = db.getDatabase;
const guilds = dataBase.collection<Guild>('guilds');

export const createGuild = async (guild: Guild): Promise<void> => {
    try {
        await findByGuildId(guild.guildID);
    } catch (err) {
        const inserted = await guilds.insertOne(guild);
        return;
    }
    throw new Error('Already exist');
}

export const findAll = async (): Promise<Guild[]> => {
    const found = await guilds.find().toArray();
    return found;
}

export const findByGuildId = async (guildID: string) => {
    const found = await guilds.findOne({guildID});

    if (found == undefined)
        throw new Error('Not found');
    return found;
}

export const updateByGuildId = async (guildID: string, toUpdate: UpdateGuild) => {
    const res = await guilds.updateOne({guildID }, {$set: toUpdate});

    if (res.modifiedCount != 1)
        throw new Error('Not found');
}