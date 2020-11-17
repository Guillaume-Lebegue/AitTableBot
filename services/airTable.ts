import {Reunion, ReunionField, ReunionPatch} from '../models/reunion.ts';
const api = 'https://api.airtable.com/v0/';

export const getFollowing = async (): Promise<Reunion[]> => {
    const url = `${api}${Deno.env.get('AIRTABLE_BASE_ID')}/${Deno.env.get('AIRTABLE_TABLE')}?sort%5B0%5D%5Bfield%5D=Date&filterByFormula=%28%7BStatus%7D%20%3D%20%27A%20venir%27%29&maxRecords=4`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('AIRTABLE_API_KEY')}`
        }
    })

    var result: {records: Reunion[], offset: string};
    if (response.status != 200)
        throw new Error('Couldn\'t get following AirTable, status code: ' + response.status);

    try {
        result = await response.json()
        result.records.forEach((reunion) => {
            reunion.fields.Date = new Date(reunion.fields.Date);
            reunion.createdTime = new Date(reunion.createdTime);
        });
    } catch (error) {
        throw new Error('Couldn\'t translate airTable Object: ' + error);
    }
    return result.records;
}

export const patchReunion = async (reunions: ReunionPatch[]): Promise<void> => {
    const url = `${api}${Deno.env.get('AIRTABLE_BASE_ID')}/${Deno.env.get('AIRTABLE_TABLE')}`;
    const body = JSON.stringify({records: reunions});
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('AIRTABLE_API_KEY')}`
        },
        body
    })

    if (response.status != 200)
        throw new Error('Couldn\'t patch AirTable, status code: ' + response.status + ' tried to patch: ' + body);
}

export const createReunion = async (reunion: ReunionField): Promise<void> => {
    const url = `${api}${Deno.env.get('AIRTABLE_BASE_ID')}/${Deno.env.get('AIRTABLE_TABLE')}`;
    const body = JSON.stringify({records: [{fields: reunion}]});
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('AIRTABLE_API_KEY')}`
        },
        body
    })

    if (response.status != 200)
        throw new Error('Couldn\'t patch AirTable, status code: ' + response.status + ' tried to post: ' + body);
}