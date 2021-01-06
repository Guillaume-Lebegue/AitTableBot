import { ReunionStatus } from "../../models/reunion.ts";
import { createReunion } from "../../services/airTable.ts";
import * as recurentS from "../../services/recurent.ts";

export default async function() {
    var loop = 0;
    while (1) {
        loop++;
        const toCreate = await recurentS.getInNextMonth();

        if (!toCreate || toCreate.length <= 0)
            return;

        for (var recur of toCreate) {
            await createReunion({
                Date: recur.lastDate, 
                Name: recur.name,
                Status: ReunionStatus.coming,
                Lien: recur.link,
                type: recur.type
            });

            const next = new Date(recur.lastDate);
            next.setDate(next.getDate() + (7 * recur.everyWeek));
            await recurentS.updateById(recur._id.toString(), {lastDate: next});
        }
        if (loop >= 6)
            return;
    }
}