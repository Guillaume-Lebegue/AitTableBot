import { getFollowing } from '../../services/airTable.ts';
import sendNotifTomorow from "../discord/sendNotifTomorow.ts";

export default async function () {
    const toCome = await getFollowing();
    const now = new Date();
    const tomorowEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        23,
        59
    );

    const tomorow = toCome.filter(reu => reu.fields.Date < tomorowEnd);
    if (tomorow.length > 0)
        await sendNotifTomorow(tomorow);
}