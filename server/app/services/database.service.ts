import { HighscoresTable } from '@app/classes/highscorestable';
import { JvName } from '@app/interfaces/jvName';
import { Db, MongoClient } from 'mongodb';
import { Service } from 'typedi';
const DATABASE_URL = 'mongodb+srv://203:Sprint3@log2990.6jndd.mongodb.net/2990?retryWrites=true&w=majority';
const DATABASE_NAME = '2990';
const DATABASE_COLLECTION = 'highscores';
const DATABASE_COLLECTION_JV = 'jvName';
const DATABASE_COLLECTION_JV_EXPERT = 'jvExpertName';
// const DATABASE_URL = 'mongodb+srv://equipe303:equipe303@clusterscore.6eoob.mongodb.net/scrabble2990?retryWrites=true&w=majority';
// const DATABASE_NAME = 'scrabble2990';
@Service()
export class DatabaseService {
    listToCompareToDBValue: HighscoresTable[] = [];
    tempData: HighscoresTable[] = [];
    jvname: JvName;

    private db: Db;
    private client: MongoClient;
    async start(url: string = DATABASE_URL): Promise<MongoClient | null> {
        try {
            const client = await MongoClient.connect(url);
            this.client = client;
            this.db = client.db(DATABASE_NAME);
        } catch {
            throw new Error('Database connection error');
        }
        return this.client;
    }
    async closeConnection(): Promise<void> {
        return this.client.close();
    }
    get database(): Db {
        return this.db;
    }
    dataToCompare(username: string, finalscore: number) {
        this.listToCompareToDBValue.push({ name: username, score: finalscore });
    }
    async addScore(highscoresTable: HighscoresTable[]): Promise<void> {
        for (const score of highscoresTable) {
            await this.db.collection(DATABASE_COLLECTION).insertOne(score);
        }
        this.db.collection(DATABASE_COLLECTION).find({}).sort({ score: -1 });
    }
    async fiveHighScoreVerification(): Promise<void> {
        const resultat = await this.db.collection(DATABASE_COLLECTION).find<HighscoresTable>({}).sort({ score: -1 }).toArray();
        for (const player of this.listToCompareToDBValue) {
            for (const result of resultat) {
                if (player.score > result.score) {
                    this.listToCompareToDBValue.push({ name: result.name, score: result.score });
                    result.name = player.name;
                    result.score = player.score;
                } else if (player.score === result.score && player.name !== result.name) {
                    result.name = result.name + ' et ' + player.name;
                }
            }
        }
        await this.db.collection(DATABASE_COLLECTION).drop();
        this.addScore(resultat);
    }
    async sendTableOfHighScores() {
        const result = await this.db.collection(DATABASE_COLLECTION).find<HighscoresTable>({}).sort({ score: -1 }).toArray();
        return result;
    }
    async populateDB(): Promise<void> {
        const scoreTemp: HighscoresTable[] = [
            {
                name: 'Marc',
                score: 100,
            },
            {
                name: 'Oussama',
                score: 80,
            },
            {
                name: 'Manal',
                score: 60,
            },
            {
                name: 'Moussa',
                score: 40,
            },
            {
                name: 'Sanmar',
                score: 20,
            },
        ];
        for (const scoretempt of scoreTemp) {
            await this.db.collection(DATABASE_COLLECTION).insertOne(scoretempt);
        }
    }
    async addNewVirtualPlayerName(name: string, category: string): Promise<boolean> {
        this.jvname.name = name;
        const resultatExpert = await this.db.collection(DATABASE_COLLECTION_JV_EXPERT).find<JvName>({}).toArray();
        for (const result of resultatExpert) {
            if (this.jvname.name === result.name) {
                return false;
            }
        }
        const resultat = await this.db.collection(DATABASE_COLLECTION_JV).find<JvName>({}).toArray();
        for (const result of resultat) {
            if (this.jvname.name === result.name) {
                return false;
            }
        }
        if (category === 'advanced') {
            await this.db.collection(DATABASE_COLLECTION_JV_EXPERT).insertOne(this.jvname);
        } else {
            await this.db.collection(DATABASE_COLLECTION_JV).insertOne(this.jvname);
        }
        return true;
    }
    async modifyVirtualPlayerName(newname: string, oldname: string, category: string) {
        this.jvname.name = oldname;
        if (category === 'advanced') {
            this.db.collection(DATABASE_COLLECTION_JV_EXPERT).updateOne(this.jvname, { $set: { name: newname } });
        } else {
            this.db.collection(DATABASE_COLLECTION_JV).updateOne(this.jvname, { $set: { name: newname } });
        }
    }
    async deleteVirtualPlayerName(name: string) {
        this.jvname.name = name;
        await this.db.collection(DATABASE_COLLECTION_JV).deleteOne(this.jvname);
    }
    async populateDBJVPlayer(): Promise<void> {
        const scoreTemp: JvName[] = [
            {
                name: 'Maiva',
            },
            {
                name: 'sanmarsimon',
            },
            {
                name: 'Aligator',
            },
        ];
        for (const scoretempt of scoreTemp) {
            await this.db.collection(DATABASE_COLLECTION).insertOne(scoretempt);
        }
    }
    async populateDBJVExpertPlayer(): Promise<void> {
        const scoreTemp: JvName[] = [
            {
                name: 'Anakin',
            },
            {
                name: 'Thanos',
            },
            {
                name: 'Darkseid',
            },
        ];
        for (const scoretempt of scoreTemp) {
            await this.db.collection(DATABASE_COLLECTION).insertOne(scoretempt);
        }
    }
    async restartDatabase() {
        await this.db.collection(DATABASE_COLLECTION).drop();
        await this.db.collection(DATABASE_COLLECTION_JV).drop();
        await this.db.collection(DATABASE_COLLECTION_JV_EXPERT).drop();
        await this.populateDB();
        await this.populateDBJVPlayer();
        await this.populateDBJVPlayer();
    }
}
