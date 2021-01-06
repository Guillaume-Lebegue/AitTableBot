import { ReunionPatch, ReunionStatus } from "../../models/reunion.ts";
import { getFollowing, patchReunion } from "../../services/airTable.ts";

export default async function() {
    const toCome = await getFollowing();
    const now = new Date();

    const toSet = toCome.filter(reu => reu.fields.Date < now);
    const patchs = toSet.map(reu => {
        const patch: ReunionPatch = {
            id: reu.id,
            fields: {
                Status: ReunionStatus.passed
            }
        }
        return patch;
    })

    if (patchs.length > 0)
        await patchReunion(patchs);
}