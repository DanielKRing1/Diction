import Realm, {ObjectSchema} from 'realm';
import {getTTS} from '../google-translate/tts';
import {getTextTranslations} from '../google-translate/ttt';
import {SourceLanguage, TargetLanguage} from '../google-translate/types';
import Flashcard, {FlashcardObj} from './FlashCardSchema';

// TYPES
// PARAMS
type FetchParams = {
  sl: SourceLanguage;
  tl: TargetLanguage;
};
interface GenerateParams {
  sText: string;

  groupId: Realm.BSON.ObjectId;
  tags: string[];
}

interface TranslationData {
  tText: string;
  tRomanization: string;
  tSpeech64: string;
}

// REALM OBJECT
export interface PhraseObj
  extends FetchParams,
    GenerateParams,
    TranslationData {
  _id: Realm.BSON.ObjectId;
  createdAt: Date;

  flashcard: FlashcardObj;
}

// CLASS
class Phrase extends Realm.Object implements PhraseObj {
  _id!: Realm.BSON.ObjectId;
  createdAt!: Date;

  sl!: SourceLanguage;
  tl!: TargetLanguage;
  sText!: string;
  tText!: string;
  tRomanization!: string;
  tSpeech64!: string;

  groupId!: Realm.BSON.ObjectId;
  tags!: string[];

  flashcard!: FlashcardObj;

  // SCHEMA

  static readonly PHRASE_SCHEMA_NAME = 'Phrase';
  static readonly schema: ObjectSchema = {
    name: Phrase.PHRASE_SCHEMA_NAME,
    primaryKey: '_id',
    properties: {
      _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
      createdAt: {type: 'date', default: () => new Date()},

      sl: 'string',
      tl: 'string',
      sText: 'string',
      tText: 'string',
      tRomanization: 'string',
      tSpeech64: 'string',

      groupId: 'objectId',
      tags: {type: 'list', objectType: 'string', default: () => []},

      flashcard: Flashcard.FLASHCARD_SCHEMA_NAME, // embedded object
    },
  };

  // IMPLEMENTATION

  static setTags(realm: Realm, phrase: Phrase, newTags: string[]) {
    realm.write(() => {
      // Update tags
      phrase.tags = newTags;
    });
  }

  static async create(
    realm: Realm,
    fParams: FetchParams,
    gParams: GenerateParams,
  ): Promise<PhraseObj> {
    const tData: TranslationData = await this.fetch(gParams.sText, fParams);
    const phraseObj: PhraseObj = this.generate(tData, fParams, gParams);

    return realm.write(() => {
      return realm.create(this.PHRASE_SCHEMA_NAME, phraseObj);
    });
  }

  private static async fetch(
    st: string,
    {sl, tl}: FetchParams,
  ): Promise<TranslationData> {
    // 1. Get text translations
    const {tt, tr} = await getTextTranslations({
      sl,
      tl,
      st,
      id: 1,
    });
    // 2. Get speech translations
    const audio64 = await getTTS(tl, tt, 1);

    // 3. Return fetched translation data
    return {
      tText: tt,
      tRomanization: tr,
      tSpeech64: audio64,
    };
  }

  private static generate(
    tData: TranslationData,
    fParams: FetchParams,
    gParams: GenerateParams,
  ): PhraseObj {
    return {
      // 1. Fill in default Realm Object fields
      _id: new Realm.BSON.ObjectId(),
      createdAt: new Date(),

      // 2. Fill in embedded Flashcard fields
      flashcard: Flashcard.generate(),

      // 3. Add fetched fields
      ...tData,

      // 4. Add fetch params
      ...fParams,

      // 5. Add user fields
      ...gParams,
    };
  }

  static delete(realm: Realm, phrase: Phrase) {
    realm.write(() => {
      // 1. Delete PhraseObj
      realm.delete(phrase);
    });
  }
}

export default Phrase;
