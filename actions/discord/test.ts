import { InteractionCommandPayload } from "https://deno.land/x/discordeno@10.0.1/mod.ts";

export default async function (inter: InteractionCommandPayload) {
    console.log('got command test, with message: ' + inter.data?.options[0].value);
}