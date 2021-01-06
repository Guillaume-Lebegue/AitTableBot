import { cron } from 'https://deno.land/x/deno_cron/cron.ts';
import createRecurent from "../actions/airTable/createRecurent.ts";
import todayNotif from '../actions/airTable/today.ts';
import tomorowNotif from '../actions/airTable/tomorow.ts';
import setPassed from '../actions/airTable/setPassed.ts';

export default function() {

    cron('0 0 8 * * *', () => {
        createRecurent();
        todayNotif();
    });

    cron('0 0 19 * * *', () => {
        tomorowNotif();
    });

    cron('0 0 * * * *', () => {
        setPassed();
    })

    console.log('Setup cron ended');
}