import '../utils/loadEnv.ts';
import { MongoClient, } from "https://deno.land/x/mongo@v0.20.0/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.20.0/bson/mod.ts";

class DB {
    public client: MongoClient;

    constructor(public dbName: string, public url: string) {
        this.dbName = dbName;
        this.url = url;
        this.client = {} as MongoClient;
    }

    async connect() {
        this.client = new MongoClient;
        await this.client.connect(this.url);
        console.log(`Connected to database ${this.dbName} at url: ${this.url}`);
    }

    get getDatabase() {
        return this.client.database(this.dbName);
    }
}

const dbName = Deno.env.get('DB_NAME') || '';
const dbHostUrl = Deno.env.get('DB_HOST_URL') || '';
const db = new DB(dbName, dbHostUrl);
await db.connect();

export { db, ObjectId };