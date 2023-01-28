import { Collection, Filter, Document, MongoClient, OptionalUnlessRequiredId, UpdateFilter } from 'mongodb';
import npmlog from './log';

type Action = (
  collection: Collection,
  onSuccess: (result: any) => void,
  onError: (error: Error) => void
) => void;

export default class Mongo {
  url: string;
  dbName: string;
  client: MongoClient;

  constructor(url: string, dbName: string) {
    this.url = url;
    this.dbName = dbName;
  }

  async connect() {
    this.client = new MongoClient(this.url);
    try {
      await this.client.connect();
      npmlog.success('Connection: ', 'Connected successfully to server');
    } catch (e) {
      throw e;
    }
  }

  connectAction(docName: string, action: Action) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.connect();
        const db = this.client.db(this.dbName);
        const collection = db.collection(docName);
        action(
          collection,
          result => {
            this.close();
            npmlog.success('result: ', result);
            resolve(result);
          },
          e => {
            npmlog.error('errorResult: ', e.toString());
            reject(e);
          },
        );
      } catch (e: any) {
        npmlog.error('errorResult: ', e.toString());
        this.close();
      }
    });
  }

  query(docName: string, filter: Filter<Document> = {}) {
    return this.connectAction(
      docName,
      async function(collection, onSuccess, onError) {
        try {
          const findResult = await collection.find(filter).toArray();
          onSuccess(findResult);
        } catch (e: any) {
          onError(e);
        }
      },
    );
  }

  insert(docName: string, docs: OptionalUnlessRequiredId<Document>[]) {
    return this.connectAction(docName, async function(collection, onSuccess, onError) {
      try {
        const insertResult = await collection.insertMany(docs);
        onSuccess(insertResult);
      } catch (e: any) {
        onError(e);
      }
    });
  }

  update(docName: string, filter: Filter<Document>, update: UpdateFilter<Document> | Partial<Document>) {
    return this.connectAction(docName, async function(collection, onSuccess, onError) {
      try {
        const insertResult = await collection.updateOne(filter, update);
        onSuccess(insertResult);
      } catch (e: any) {
        onError(e);
      }
    });
  }

  delete(docName: string, filter: Filter<Document>) {
    return this.connectAction(docName, async function(collection, onSuccess, onError) {
      try {
        const deleteResult = await collection.deleteMany(filter);
        onSuccess(deleteResult);
      } catch (e: any) {
        onError(e);
      }
    });
  }

  close() {
    this.client.close();
  }
}
