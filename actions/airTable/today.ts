import { getFollowing } from "../../services/airTable.ts";
import sendNotifToday from '../discord/sendNotifToday.ts';

export default async function() {
    const toCome = await getFollowing();
    const now = new Date();
    const tomorowEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59
    );

    const tomorow = toCome.filter(reu => reu.fields.Date < tomorowEnd);
    tomorow.forEach(async reu => await sendNotifToday(reu));
}