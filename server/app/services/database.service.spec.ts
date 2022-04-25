/* eslint-disable dot-notation */
import { HighscoresTable } from '@app/classes/highscorestable';
import { JvName } from '@app/interfaces/jvName';
import { expect } from 'chai';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DatabaseService } from './database.service';

describe('database service', () => {
    let databaseService: DatabaseService;
    const DATABASE_NAME = '2990';
    const DATABASE_COLLECTION = 'highscores';
    const DATABASE_COLLECTION_JV = 'jvName';
    const DATABASE_COLLECTION_JV_EXPERT = 'jvExpertName';
    let mongoServer: MongoMemoryServer;
    let db: Db;

    const highscore: HighscoresTable[] = [
        {
            name: 'first',
            score: 25,
        },
    ];
    const jv: JvName = {
        name: 'gametestjv',
    };
    beforeEach(async () => {
        databaseService = new DatabaseService();
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await MongoClient.connect(mongoUri).then((client: MongoClient) => {
            db = client.db(DATABASE_NAME);
        });
        databaseService = new DatabaseService();
        databaseService['db'] = db;
    });
    after(() => {
        databaseService.closeConnection();
        mongoServer.stop();
    });
    afterEach(async () => {
        databaseService['db'].collection(DATABASE_COLLECTION).drop();
        databaseService['db'].collection(DATABASE_COLLECTION_JV).drop();
        databaseService['db'].collection(DATABASE_COLLECTION_JV_EXPERT).drop();
    });
    it('should return a client when connection is established', async () => {
        return databaseService.start(mongoServer.getUri()).then((result: MongoClient) => {
            return expect(result.db(DATABASE_NAME).collection(DATABASE_COLLECTION).collectionName).to.equals(DATABASE_COLLECTION);
        });
    });
    it('should throw an error when connection is not established', async (done) => {
        try {
            databaseService.start('Url non existant');
        } catch (err) {
            expect(err).to.eql(new Error('Database connection error'));
        }
        done();
    });
    it('should get the scores stored in collection', async () => {
        await databaseService.addScore(highscore);
        return databaseService.sendTableOfHighScores().then((result: HighscoresTable[]) => {
            return expect(result[0].name).to.equals(highscore[0].name);
        });
    });
    it('should return true', async () => {
        expect(databaseService.addNewVirtualPlayerName(jv.name, 'advanced')).to.equal(true);
    });
});
