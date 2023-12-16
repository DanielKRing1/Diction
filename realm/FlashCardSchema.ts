import Realm, {ObjectSchema} from 'realm';

// REALM OBJECT
export interface FlashcardObj {
  last5Reviews: boolean[];
  lastReviewed: Date;
}

// CLASS
class Flashcard extends Realm.Object implements FlashcardObj {
  last5Reviews!: boolean[];
  lastReviewed!: Date;

  // SCHEMA

  static readonly FLASHCARD_SCHEMA_NAME = 'Flashcard';
  static readonly schema: ObjectSchema = {
    name: Flashcard.FLASHCARD_SCHEMA_NAME,
    embedded: true,
    properties: {
      last5Reviews: {type: 'list', objectType: 'boolean', default: () => []},
      lastReviewed: {type: 'date', default: () => new Date()},
    },
  };

  // IMPLEMENTATION

  static generate(): FlashcardObj {
    return {
      // 1. Fill in default Realm Object fields
      last5Reviews: [],
      lastReviewed: new Date(),
    };
  }
}

export default Flashcard;
