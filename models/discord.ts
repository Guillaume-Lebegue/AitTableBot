export interface Guild {
    _id?: string;
    guildID: string;
    channelNotifId?: string;
    roleNotifId?: string;
}

export interface UpdateGuild {
    channelNotifId?: string;
    roleNotifId?: string;
}