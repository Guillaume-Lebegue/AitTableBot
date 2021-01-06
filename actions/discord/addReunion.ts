import { InteractionCommandPayload } from "https://deno.land/x/discordeno@10.0.1/src/types/interactions.ts";
import { createSlashCommand, executeSlashCommand, InteractionResponseType, SlashCommandOptionType } from "https://deno.land/x/discordeno@10.0.1/mod.ts";
import { ReunionField, ReunionStatus } from "../../models/reunion.ts";
import { createReunion } from '../../services/airTable.ts';

export const setup = function (guildID: string) {
    createSlashCommand({
        name: 'addreunion',
        description: 'Add new reunion to airtable',
        guildID,
        options: [
            {
                type: SlashCommandOptionType.STRING,
                name: 'name',
                description: 'Name of the reunion',
                required: true
            }, {
                type: SlashCommandOptionType.STRING,
                name: 'link',
                description: 'Link of the reunion (or where it happen)',
                required: true
            }, {
                type: SlashCommandOptionType.STRING,
                name: 'type',
                description: 'Type of the reunion',
                required: true,
                choices: [
                    {
                        name: 'rdv mentor',
                        value: 'rdv mentor'
                    }, {
                        name: 'rdv de groupe',
                        value: 'rdv de groupe'
                    }
                ]
            }, {
                type: SlashCommandOptionType.INTEGER,
                name: 'dateday',
                description: 'Day of the reunion (number)',
                required: true
            }, {
                type: SlashCommandOptionType.INTEGER,
                name: 'datemonth',
                description: 'Month of the reunion (number)',
                required: true
            }, {
                type: SlashCommandOptionType.INTEGER,
                name: 'dateyear',
                description: 'Year of the reunion (number)',
                required: true
            }, {
                type: SlashCommandOptionType.INTEGER, 
                name: 'datehour',
                description: 'Hour of the reunion (number)',
                required: true
            }, {
                type: SlashCommandOptionType.INTEGER,
                name: 'dateminute',
                description: 'Minute of the reunion (number)',
                required: true
            }
        ]
    });
}

export const execute = async function (inter: InteractionCommandPayload) {
    var refusedReason: string | undefined;
    const nameRaw = inter.data?.options.find(value => value.name == 'name')?.value?.toString();
    const linkRaw = inter.data?.options.find(value => value.name == 'link')?.value?.toString();
    const typeRaw = inter.data?.options.find(value => value.name == 'type')?.value?.toString();
    const dateDayRaw = inter.data?.options.find(value => value.name == 'dateday')?.value?.toString();
    const dateMonthRaw = inter.data?.options.find(value => value.name == 'datemonth')?.value?.toString();
    const dateYearRaw = inter.data?.options.find(value => value.name == 'dateyear')?.value?.toString();
    const dateHourRaw = inter.data?.options.find(value => value.name == 'datehour')?.value?.toString();
    const dateMinuteRaw = inter.data?.options.find(value => value.name == 'dateminute')?.value?.toString();

    if (!nameRaw)
        refusedReason = 'Bad name';
    else if (!linkRaw)
        refusedReason = 'Bad link';
    else if (!typeRaw)
        refusedReason = 'Bad type';
    else if (!dateDayRaw)
        refusedReason = 'Bad date day';
    else if (!dateMonthRaw)
        refusedReason = 'Bad date month';
    else if (!dateYearRaw)
        refusedReason = 'Bad date year';
    else if (!dateHourRaw)
        refusedReason = 'Bad date hour';
    else if (!dateMinuteRaw)
        refusedReason = 'Bad date minute';

    var name: string | undefined;
    var link: string | undefined;
    var type: string | undefined;
    var dateDay: number | undefined;
    var dateMonth: number | undefined;
    var dateYear: number | undefined;
    var dateHour: number | undefined;
    var dateMinute: number | undefined;
    var fullDate: Date | undefined;
    if (!refusedReason) {
        name = nameRaw as string;
        link = linkRaw as string;
        type = typeRaw as string;
        dateDay = parseInt(dateDayRaw as string);
        dateMonth = parseInt(dateMonthRaw as string);
        dateYear = parseInt(dateYearRaw as string);
        dateHour = parseInt(dateHourRaw as string);
        dateMinute = parseInt(dateMinuteRaw as string);
    }

    if (!refusedReason) {
        if ((dateDay as number) <= 0 || (dateDay as number) > 31)
            refusedReason = '0 < dateDay > 31';
        else if ((dateMonth as number) <= 0 || (dateMonth as number) > 12)
            refusedReason = '0 < dateMonth > 12';
        else if ((dateYear as number) <= 0)
            refusedReason = 'dateYear > 0';
        else if ((dateHour as number) < 0 || (dateHour as number) >= 24)
            refusedReason = '0 < dateHour > 24';
        else if ((dateMinute as number) < 0 || (dateMinute as number) >= 60)
            refusedReason = '0 < dateMinute > 60';
    }

    if (!refusedReason) {
        fullDate = new Date(
            dateYear as number,
            (dateMonth as number) - 1,
            dateDay as number,
            dateHour as number,
            dateMinute as number
            );

        if (!fullDate)
            refusedReason = 'Date could\'nt be made';

        if (!refusedReason && fullDate < new Date(Date.now()))
            refusedReason = 'Date is before today';
    }

    var fields: ReunionField | undefined;
    if (!refusedReason) {
        fields = {
            Name: name as string,
            Status: ReunionStatus.coming,
            Date: fullDate as Date,
            Lien: link as string,
            type: type as string
        }
    }

    if (!refusedReason) {
        await createReunion(fields as ReunionField);

        executeSlashCommand(inter.id, inter.token, {
            type: InteractionResponseType.CHANNEL_MESSAGE,
            data: {
                content: `New reunion \`${fields?.Name}\` added`
            }
        });
    } else {
        executeSlashCommand(inter.id, inter.token, {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: 'Refused: ' + refusedReason
            }
        });
    }
}