import Realm, {ObjectSchema} from 'realm';

import Phrase, {PhraseObj} from './PhraseSchema';
import {RealmObject} from '.';

// REALM OBJECT
export interface GroupObj {
  _id: Realm.BSON.ObjectId;
  createdAt: Date;

  lastUpdated: Date;
  lastUsed: Date;

  name: string;
}

class Group extends Realm.Object implements GroupObj {
  _id!: Realm.BSON.ObjectId;
  createdAt!: Date;

  lastUpdated!: Date;
  lastUsed!: Date;

  name!: string;

  // SCHEMA

  static readonly GROUP_SCHEMA_NAME = 'Group';
  static readonly schema: ObjectSchema = {
    name: Group.GROUP_SCHEMA_NAME,
    primaryKey: '_id',
    properties: {
      _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
      createdAt: {type: 'date', default: () => new Date()},

      lastUpdated: {type: 'date', default: () => new Date()},
      lastUsed: {type: 'date', default: () => new Date()},

      name: 'string',
    },
  };

  // IMPLEMENTATION

  static async create(realm: Realm, name: string): Promise<GroupObj> {
    // 1. Generate new row object
    const groupObj: GroupObj = this.generate(name);

    // 2. Save to Realm
    return realm.write(() => {
      return realm.create(this.GROUP_SCHEMA_NAME, groupObj);
    });
  }

  private static generate(name: string): GroupObj {
    return {
      // 1. Fill in default Realm Object fields
      _id: new Realm.BSON.ObjectId(),
      createdAt: new Date(),

      lastUpdated: new Date(),
      lastUsed: new Date(),

      // 2. Add user fields
      name,
    };
  }

  static delete(realm: Realm, groupId: Realm.BSON.ObjectId) {
    // 1. Get GroupObj
    const groupObj: GroupObj | null = realm.objectForPrimaryKey(
      this.GROUP_SCHEMA_NAME,
      groupId,
    );
    if (groupObj === null) return;

    // 2. Get associated PhraseObj's
    const phraseObjs: Realm.Results<RealmObject<PhraseObj>> = realm
      .objects<PhraseObj>(Phrase.PHRASE_SCHEMA_NAME)
      .filtered('group = $0', groupId);

    realm.write(() => {
      // 3. Delete PhraseObj's
      for (const phraseObj of phraseObjs) {
        realm.delete(phraseObj);
      }

      // 4. Delete GroupObj
      realm.delete(groupObj);
    });
  }
}

export default Group;
