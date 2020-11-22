import type { Recurent, NewRecurent, UpdateRecurent } from '../models/recurent.ts';
import { db, ObjectId } from './dateBase.ts';

const dataBase = db.getDatabase;
const recurents = dataBase.collection<Recurent>('recurents');

export const createRecurent = async (newRecurent: NewRecurent) => {
    const inserted = await recurents.insertOne(newRecurent);
    return inserted;
}

export const findById = async (recurentId: string) => {
    let id: ObjectId;
    try {
        id = ObjectId(recurentId);
    } catch (error) {
        throw new Error('Bad id');
    }
    const recurent = await recurents.findOne({ _id: id });

    if (recurent)
        return recurent as Recurent;

    throw new Error('Not found');
}

export const updateById = async (recurentId: string, toUpdate: UpdateRecurent) => {
    let id: ObjectId;
    try {
        id = ObjectId(recurentId);
    } catch (error) {
        throw new Error('Bad id');
    }
    const { matchedCount } = await recurents.updateOne(
        { _id: id },
        { $set: toUpdate }
    );

    if (matchedCount == 0)
        throw new Error('Not found');
}

export const deleteById = async (recurentId: string) => {
    let id: ObjectId;
    try {
        id = ObjectId(recurentId);
    } catch (error) {
        throw new Error('Bad id');
    }
    const deleteCount = await recurents.deleteOne({ _id: id });

    if (deleteCount == 0)
        throw new Error('Not found');
}

export const getInNextMonth = async () => {
    var now = new Date(Date.now());
    var limit = new Date(now.setMonth((now.getMonth() + 1) % 12));

    const filter = {
        lastDate: {
            $lt: limit
        }
    };
    const foundRecur: Recurent[] = await recurents.find(filter);
    return foundRecur;
}