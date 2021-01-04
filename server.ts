import './utils/loadEnv.ts';
import { startBot, Intents } from "https://deno.land/x/discordeno@10.0.1/mod.ts";
import * as DiscordS from "./services/discord.ts";

startBot({
    token: Deno.env.get('DISCORD_TOKEN') || '',
    intents: [
        Intents.GUILDS,
        Intents.GUILD_MESSAGES,
        Intents.GUILD_MESSAGE_REACTIONS,
        Intents.DIRECT_MESSAGES,
        Intents.DIRECT_MESSAGE_REACTIONS
    ],
    eventHandlers: {
        ready: DiscordS.onReady,
        messageCreate: DiscordS.onMessageCreate,
        interactionCreate: DiscordS.onInteractionCreate as (data: unknown) => unknown
    }
});