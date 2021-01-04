import { InteractionCommandPayload } from "https://deno.land/x/discordeno@10.0.1/mod.ts";
import { setupGuild } from '../../services/discord.ts';

export default async function (interaction: InteractionCommandPayload) {
    if (interaction.guild_id.length == 0)
        return;

    setupGuild(interaction.guild_id);
}