import Realm, {ObjectSchema} from 'realm';

import Phrase from './PhraseSchema';
import {RealmObject} from '.';

// REALM OBJECT
export interface GroupObj {
  _id: Realm.BSON.ObjectId;
  createdAt: Date;

  name: string;
  lastUsed: Date;
}

class Group extends Realm.Object implements GroupObj {
  _id!: Realm.BSON.ObjectId;
  createdAt!: Date;

  name!: string;
  lastUsed!: Date;

  // SCHEMA

  static readonly GROUP_SCHEMA_NAME = 'Group';
  static readonly schema: ObjectSchema = {
    name: Group.GROUP_SCHEMA_NAME,
    primaryKey: '_id',
    properties: {
      _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
      createdAt: {type: 'date', default: () => new Date()},

      name: 'string',
      lastUsed: {type: 'date', default: () => new Date()},
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

      // 2. Add user fields
      name,
      lastUsed: new Date(),
    };
  }

  static delete(realm: Realm, groupId: Realm.BSON.ObjectId) {
    // 1. Get GroupObj
    const groupObj: GroupObj | null = realm.objectForPrimaryKey(
      this.GROUP_SCHEMA_NAME,
      groupId,
    );
    if (groupObj === null) return;

    // 2. Get associated Phrases
    const phraseObjs: Realm.Results<RealmObject<Phrase>> = realm
      .objects<Phrase>(Phrase.PHRASE_SCHEMA_NAME)
      .filtered('group = $0', groupId);

    realm.write(() => {
      // 3. Delete Phrases
      for (const phraseObj of phraseObjs) {
        realm.delete(phraseObj);
      }

      // 4. Delete GroupObj
      realm.delete(groupObj);
    });
  }

  // TODO: Implement
  static updateLastUsed(realm: Realm, groupId: Realm.BSON.ObjectId) {}
}

export default Group;
