import Realm, {ObjectSchema} from 'realm';
import {getTTS} from '../google-translate/tts';
import {getTextTranslations} from '../google-translate/ttt';
import {SourceLanguage, TargetLanguage} from '../google-translate/types';

// TYPES
// PARAMS
type TranslateParams = {
  sl: SourceLanguage;
  tl: TargetLanguage;
};
interface GenerateParams {
  sText: string;
  group: string;
  tags: string[];
}
interface FillParams extends GenerateParams {
  tText: string;
  tRomanization: string;
  tSpeech64: string;
}
// REALM OBJECT
interface PhraseObj extends FillParams {
  _id: Realm.BSON.ObjectId;
  createdAt: Date;
}

// CLASS
class Phrase extends Realm.Object implements PhraseObj {
  sText!: string;
  group!: string;
  tags!: string[];
  tText!: string;
  tRomanization!: string;
  tSpeech64!: string;
  _id!: Realm.BSON.ObjectId;
  createdAt!: Date;

  /**
   * Generate and fill in a PhraseObj from google translate api
   * Then create PhraseObj in Realm
   *
   * @param realm
   * @param tParams
   * @param gParams
   * @returns
   */
  static async createG(
    realm: Realm,
    tParams: TranslateParams,
    gParams: GenerateParams,
  ) {
    const phraseObj: PhraseObj = await this.generate(tParams, gParams);

    return realm.write(() => {
      realm.create(this.PHRASE_SCHEMA_NAME, phraseObj);
    });
  }

  /**
   * Fill in a PhraseObj from params
   * Then create PhraseObj in Realm
   *
   * @param realm
   * @param fParams
   * @returns
   */
  static async createF(realm: Realm, fParams: FillParams) {
    const phraseObj: PhraseObj = this.fill(fParams);

    return realm.write(() => {
      realm.create(this.PHRASE_SCHEMA_NAME, phraseObj);
    });
  }

  private static async generate(
    {sl, tl}: TranslateParams,
    gParams: GenerateParams,
  ): Promise<PhraseObj> {
    // 1. Get text translations
    const {tt, tr} = await getTextTranslations({
      sl,
      tl,
      st: gParams.sText,
      id: 1,
    });
    // 2. Get speech translations
    const audio64 = await getTTS(tl, tt, 1);

    // 3. Fill in Realm Object fields
    const fillParams: FillParams = {
      ...gParams,
      tText: tt,
      tRomanization: tr,
      tSpeech64: audio64,
    };

    return this.fill(fillParams);
  }

  private static fill(params: FillParams): PhraseObj {
    return {
      // 1. Fill in default Realm Object fields
      _id: new Realm.BSON.ObjectId(),
      createdAt: new Date(),

      // 2. Add known fields
      ...params,
    };
  }

  static readonly PHRASE_SCHEMA_NAME = 'Phrase';
  static readonly schema: ObjectSchema = {
    name: Phrase.PHRASE_SCHEMA_NAME,
    primaryKey: '_id',
    properties: {
      _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
      createdAt: {type: 'date', default: () => new Date()},

      sText: 'string',
      tText: 'string',
      tRomanization: 'string',
      tSpeech64: 'string',

      group: 'string',
      tags: {type: 'list', objectType: 'string', default: () => []},
    },
  };
}

export default Phrase;
