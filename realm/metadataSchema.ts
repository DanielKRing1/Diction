import Realm, {ObjectSchema} from 'realm';
import Phrase from './phraseSchema';

const GROUP_NAMES_ROW_ID: string = 'GROUP_NAMES';
const GROUP_NAMES_ROW_KEY: string = 'NAMES';

interface MetadataObj {
  _id: string;
  createdAt: Date;

  jsonStr: string;
}

class Metadata extends Realm.Object implements MetadataObj {
  _id!: string;
  createdAt!: Date;
  jsonStr!: string;

  // UTILS

  /**
   * row = {
   *    [GROUP_NAMES_ROW_KEY]: [...]
   * }
   *
   * @param realm
   * @param newGroupName
   */
  static async addGroupName(realm: Realm, newGroupName: string): Promise<void> {
    // 1. Get json for GroupNames metadata row
    const row = await this.getJson(realm, GROUP_NAMES_ROW_ID);
    const json = JSON.parse(row.jsonStr);

    // 2. Nested names key does not exist in row, so add
    if (!json[GROUP_NAMES_ROW_KEY]) json[GROUP_NAMES_ROW_KEY] = [];

    // 3. Convert names list to set
    const groupNamesSet: Set<string> = new Set(json[GROUP_NAMES_ROW_KEY]);

    // 4. Add new group name
    groupNamesSet.add(newGroupName);

    // 5. Set new names list in json
    const newNamesList: string[] = Array.from(groupNamesSet);
    json[GROUP_NAMES_ROW_KEY] = newNamesList;

    // 6. Save to Realm
    realm.write(() => {
      row.jsonStr = JSON.stringify(json);
    });
  }

  static async rmGroupName(realm: Realm, groupName: string): Promise<boolean> {
    // 0. Delete all Phrases that belong to groupName
    // Get all in group
    const groupPhrases = realm
      .objects(Phrase.PHRASE_SCHEMA_NAME)
      .filtered('group == $0', groupName);
    // Delete
    realm.write(() => {
      realm.delete(groupPhrases);
    });

    // 1. Get json for GroupNames metadata row
    const row = await this.getJson(realm, GROUP_NAMES_ROW_ID);
    const json = JSON.parse(row.jsonStr);

    // 2. Nested names key does not exist in row, so add
    if (!json[GROUP_NAMES_ROW_KEY]) json[GROUP_NAMES_ROW_KEY] = [];

    // 3. Convert names list to set
    const groupNamesSet: Set<string> = new Set(json[GROUP_NAMES_ROW_KEY]);

    // 4. Rm group name
    const deleted: boolean = groupNamesSet.delete(groupName);

    // 5. Set new names list in json
    const newNamesList: string[] = Array.from(groupNamesSet);
    json[GROUP_NAMES_ROW_KEY] = newNamesList;

    // 6. Save to Realm
    realm.write(() => {
      row.jsonStr = JSON.stringify(json);
    });

    return deleted;
  }

  // IMPLEMENTATION

  private static async getJson(
    realm: Realm,
    _id: string,
  ): Promise<MetadataObj> {
    // 1. Get metadataObj
    const metadataObj: MetadataObj | null =
      realm.objectForPrimaryKey<MetadataObj>(this.METADATA_SCHEMA_NAME, _id);
    // 2. Create jsonStr row if not exists
    if (metadataObj === null) return await this.create(realm, _id, {});
    return metadataObj;
  }

  private static async create(
    realm: Realm,
    _id: string,
    jsonStr: Record<string, any>,
  ): Promise<MetadataObj> {
    // 1. Generate new row object
    const metadataObj: MetadataObj = await this.generate(_id, jsonStr);

    // 2. Save to Realm
    return new Promise(res =>
      realm.write(() => {
        const obj = realm.create(this.METADATA_SCHEMA_NAME, metadataObj);

        res(obj);
      }),
    );
  }

  private static async generate(_id: string, jsonStr: Record<string, any>) {
    return {
      // 1. Fill in default Realm Object fields
      _id,
      createdAt: new Date(),

      // 2. Add known fields
      jsonStr: JSON.stringify(jsonStr),
    };
  }

  static readonly METADATA_SCHEMA_NAME = 'Metadata';
  static readonly schema: ObjectSchema = {
    name: Metadata.METADATA_SCHEMA_NAME,
    primaryKey: '_id',
    properties: {
      _id: 'string',
      createdAt: {type: 'date', default: () => new Date()},

      jsonStr: 'string',
    },
  };
}

export default Metadata;
